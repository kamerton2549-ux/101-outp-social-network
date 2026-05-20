"""
Личные фото участника.
GET /?member_id=N   — список фото участника
POST /              — загрузить своё фото (передаётся member_id в теле)
"""
import json
import os
import base64
import uuid
import boto3
import psycopg2

SCHEMA = "t_p17442137_101_outp_social_netw"
ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_SIZE_MB = 10

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    params = event.get("queryStringParameters") or {}

    if method == "GET":
        member_id = params.get("member_id")
        if not member_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "member_id обязателен"}, ensure_ascii=False)}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, url, caption, created_at FROM {SCHEMA}.member_photos WHERE member_id = %s ORDER BY created_at DESC",
            (member_id,)
        )
        rows = cur.fetchall()
        conn.close()
        photos = [{"id": r[0], "url": r[1], "caption": r[2], "created_at": str(r[3])} for r in rows]
        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"photos": photos}, ensure_ascii=False),
        }

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        data_url = body.get("image", "")
        member_id = body.get("member_id")
        caption = body.get("caption", "")

        if not data_url or not member_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Поля image и member_id обязательны"}, ensure_ascii=False)}

        if "," not in data_url:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неверный формат изображения"}, ensure_ascii=False)}

        header, encoded = data_url.split(",", 1)
        content_type = "image/jpeg"
        if ":" in header and ";" in header:
            content_type = header.split(":")[1].split(";")[0].strip()

        if content_type not in ALLOWED_TYPES:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Допустимые форматы: JPG, PNG, WEBP"}, ensure_ascii=False)}

        image_bytes = base64.b64decode(encoded)
        if len(image_bytes) / (1024 * 1024) > MAX_SIZE_MB:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": f"Максимум {MAX_SIZE_MB} МБ"}, ensure_ascii=False)}

        ext = content_type.split("/")[1]
        if ext == "jpeg":
            ext = "jpg"
        filename = f"member-photos/{uuid.uuid4().hex}.{ext}"

        s3 = boto3.client(
            "s3",
            endpoint_url="https://bucket.poehali.dev",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )
        s3.put_object(Bucket="files", Key=filename, Body=image_bytes, ContentType=content_type)
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{filename}"

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.member_photos (member_id, url, caption) VALUES (%s, %s, %s) RETURNING id",
            (member_id, cdn_url, caption)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"id": new_id, "url": cdn_url}, ensure_ascii=False),
        }

    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Method not allowed"})}
