"""
API для профилей участников 101 ОУТП.
GET  /         — список одобренных участников (с фильтрами)
POST /         — подать заявку на регистрацию профиля
GET  /?admin=1 — список всех заявок (pending/approved/rejected) — требует X-Admin-Password
PATCH /        — одобрить или отклонить заявку — требует X-Admin-Password
Simple Query Protocol: SQL строится inline (без parameterized binding).
"""
import json
import os
import psycopg
from psycopg.rows import dict_row

SCHEMA = "t_p17442137_101_outp_social_netw"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
}


def get_conn():
    return psycopg.connect(os.environ["DATABASE_URL"], row_factory=dict_row)


def ok(data, status=200):
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }


def err(msg, status=400):
    return {
        "statusCode": status,
        "headers": CORS,
        "body": json.dumps({"error": msg}, ensure_ascii=False),
    }


def esc(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"


def esc_arr(lst):
    if not lst:
        return "NULL"
    items = ",".join("'" + str(v).replace("'", "''") + "'" for v in lst)
    return "ARRAY[" + items + "]"


def esc_int(val):
    if val is None:
        return "NULL"
    try:
        return str(int(val))
    except (ValueError, TypeError):
        return "NULL"


def check_admin(event: dict) -> bool:
    headers = event.get("headers") or {}
    pwd = headers.get("X-Admin-Password") or headers.get("x-admin-password") or ""
    return pwd == os.environ.get("ADMIN_PASSWORD", "")


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    if method == "GET" and params.get("admin") == "1":
        if not check_admin(event):
            return err("Неверный пароль", 403)
        return get_pending(event)

    if method == "GET":
        return get_members(event)

    if method == "POST":
        return create_member(event)

    if method == "PATCH":
        if not check_admin(event):
            return err("Неверный пароль", 403)
        return moderate_member(event)

    return err("Method not allowed", 405)


def get_members(event: dict) -> dict:
    params = event.get("queryStringParameters") or {}
    battalion = params.get("battalion", "")
    tank      = params.get("tank", "")
    search    = params.get("search", "")

    conditions = ["status = 'approved'"]

    if battalion:
        conditions.append("battalion = " + esc(battalion))
    if tank:
        conditions.append(esc(tank) + " = ANY(tanks)")
    if search:
        s = esc("%" + search + "%")
        conditions.append("(full_name ILIKE " + s + " OR role ILIKE " + s + ")")

    where = " AND ".join(conditions)

    sql = (
        "SELECT id, full_name, rank, years_from, years_to,"
        " battalion, role, tanks, hometown, bio, photo_url, created_at"
        " FROM " + SCHEMA + ".members"
        " WHERE " + where +
        " ORDER BY created_at DESC LIMIT 100"
    )

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()

    for r in rows:
        if r.get("tanks") is None:
            r["tanks"] = []

    return ok({"members": rows, "total": len(rows)})


def get_pending(event: dict) -> dict:
    params = event.get("queryStringParameters") or {}
    status_filter = params.get("status", "pending")
    allowed = {"pending", "approved", "rejected", "all"}
    if status_filter not in allowed:
        status_filter = "pending"

    if status_filter == "all":
        where = "1=1"
    else:
        where = "status = " + esc(status_filter)

    sql = (
        "SELECT id, full_name, rank, birth_year, hometown, email, phone,"
        " years_from, years_to, battalion, company, role,"
        " tanks, awards, bio, photo_url, status, created_at"
        " FROM " + SCHEMA + ".members"
        " WHERE " + where +
        " ORDER BY created_at DESC LIMIT 200"
    )

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()

    for r in rows:
        if r.get("tanks") is None:
            r["tanks"] = []

    return ok({"members": rows, "total": len(rows)})


def moderate_member(event: dict) -> dict:
    try:
        raw = event.get("body") or "{}"
        body = json.loads(raw) if isinstance(raw, str) else raw
    except json.JSONDecodeError:
        return err("Invalid JSON")

    member_id = body.get("id")
    action    = body.get("action")  # "approve" | "reject"

    if not member_id:
        return err("Поле id обязательно")
    if action not in ("approve", "reject"):
        return err("action должен быть approve или reject")

    new_status = "approved" if action == "approve" else "rejected"

    sql = (
        "UPDATE " + SCHEMA + ".members"
        " SET status = " + esc(new_status) +
        " WHERE id = " + esc_int(member_id) +
        " RETURNING id, full_name, status"
    )

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            row = cur.fetchone()
        conn.commit()

    if not row:
        return err("Участник не найден", 404)

    return ok({"success": True, "id": row["id"], "status": row["status"], "name": row["full_name"]})


def create_member(event: dict) -> dict:
    try:
        raw = event.get("body") or "{}"
        body = json.loads(raw) if isinstance(raw, str) else raw
    except json.JSONDecodeError:
        return err("Invalid JSON")

    full_name = (body.get("full_name") or "").strip()
    if not full_name:
        return err("Поле «ФИО» обязательно")

    tanks = body.get("tanks") or []
    if isinstance(tanks, str):
        tanks = [t.strip() for t in tanks.split(",") if t.strip()]

    sql = (
        "INSERT INTO " + SCHEMA + ".members"
        " (full_name, birth_year, hometown, email, phone,"
        "  rank, years_from, years_to, battalion, company, role,"
        "  tanks, location, awards, bio, photo_url, status)"
        " VALUES ("
        + esc(full_name) + ","
        + esc_int(body.get("birth_year")) + ","
        + esc(body.get("hometown")) + ","
        + esc(body.get("email")) + ","
        + esc(body.get("phone")) + ","
        + esc(body.get("rank")) + ","
        + esc_int(body.get("years_from")) + ","
        + esc_int(body.get("years_to")) + ","
        + esc(body.get("battalion")) + ","
        + esc(body.get("company")) + ","
        + esc(body.get("role")) + ","
        + esc_arr(tanks) + ","
        + esc(body.get("location") or "Дрезден") + ","
        + esc(body.get("awards")) + ","
        + esc(body.get("bio")) + ","
        + esc(body.get("photo_url")) + ","
        "'pending') RETURNING id"
    )

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            row = cur.fetchone()
        conn.commit()

    return ok(
        {
            "success": True,
            "id": row["id"],
            "message": "Заявка принята. После проверки модератором ваш профиль появится в списке участников.",
        },
        201,
    )
