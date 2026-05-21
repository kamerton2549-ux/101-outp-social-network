"""
Галерея полка 101 ОУТП.
GET /           — список категорий с количеством фото
GET /?category_id=N — фото по категории
POST /          — загрузить фото (только для администратора)
PUT /?id=N      — обновить подпись к фото
"""
import json
import os
import base64
import uuid
import boto3
import psycopg2

SCHEMA = "t_p17442137_101_outp_social_netw"
ADMIN_TOKEN = os.environ.get("ADMIN_PASSWORD", "")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_SIZE_MB = 10


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    params = event.get("queryStringParameters") or {}
    category_id = params.get("category_id")

    if method == "GET":
        conn = get_db()
        cur = conn.cursor()

        if category_id:
            cur.execute(
                f"""SELECT id, url, caption, created_at
                    FROM {SCHEMA}.gallery_photos
                    WHERE category_id = %s
                    ORDER BY created_at DESC""",
                (category_id,)
            )
            rows = cur.fetchall()
            photos = [
                {"id": r[0], "url": r[1], "caption": r[2], "created_at": str(r[3])}
                for r in rows
            ]
            conn.close()
            return {
                "statusCode": 200,
                "headers": {**CORS, "Content-Type": "application/json"},
                "body": json.dumps({"photos": photos}, ensure_ascii=False),
            }
        else:
            cur.execute(
                f"""SELECT c.id, c.name, c.slug, c.description, c.sort_order,
                           COUNT(p.id) as photo_count
                    FROM {SCHEMA}.gallery_categories c
                    LEFT JOIN {SCHEMA}.gallery_photos p ON p.category_id = c.id
                    GROUP BY c.id, c.name, c.slug, c.description, c.sort_order
                    ORDER BY c.sort_order"""
            )
            rows = cur.fetchall()
            categories = [
                {"id": r[0], "name": r[1], "slug": r[2], "description": r[3],
                 "sort_order": r[4], "photo_count": r[5]}
                for r in rows
            ]
            conn.close()
            return {
                "statusCode": 200,
                "headers": {**CORS, "Content-Type": "application/json"},
                "body": json.dumps({"categories": categories}, ensure_ascii=False),
            }

    if method == "POST":
        token = (event.get("headers") or {}).get("X-Admin-Token", "")
        if ADMIN_TOKEN and token != ADMIN_TOKEN:
            return {
                "statusCode": 403,
                "headers": CORS,
                "body": json.dumps({"error": "Нет доступа"}, ensure_ascii=False),
            }

        body = json.loads(event.get("body") or "{}")
        data_url = body.get("image", "")
        cat_id = body.get("category_id")
        caption = body.get("caption", "")

        if not data_url or not cat_id:
            return {
                "statusCode": 400,
                "headers": CORS,
                "body": json.dumps({"error": "Поля image и category_id обязательны"}, ensure_ascii=False),
            }

        if "," not in data_url:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неверный формат изображения"}, ensure_ascii=False)}

        header, encoded = data_url.split(",", 1)
        content_type = "image/jpeg"
        if ":" in header and ";" in header:
            content_type = header.split(":")[1].split(";")[0].strip()

        if content_type not in ALLOWED_TYPES:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Допустимые форматы: JPG, PNG, WEBP"}, ensure_ascii=False)}

        image_bytes = base64.b64decode(encoded)
        size_mb = len(image_bytes) / (1024 * 1024)
        if size_mb > MAX_SIZE_MB:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": f"Файл слишком большой. Максимум {MAX_SIZE_MB} МБ"}, ensure_ascii=False)}

        ext = content_type.split("/")[1]
        if ext == "jpeg":
            ext = "jpg"
        filename = f"gallery/{uuid.uuid4().hex}.{ext}"

        s3 = boto3.client(
            "s3",
            endpoint_url="https://bucket.poehali.dev",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )
        s3.put_object(Bucket="files", Key=filename, Body=image_bytes, ContentType=content_type)
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{filename}"

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"""INSERT INTO {SCHEMA}.gallery_photos (category_id, url, caption)
                VALUES (%s, %s, %s) RETURNING id""",
            (cat_id, cdn_url, caption)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"id": new_id, "url": cdn_url}, ensure_ascii=False),
        }

    if method == "PUT":
        token = (event.get("headers") or {}).get("X-Admin-Token", "")
        if ADMIN_TOKEN and token != ADMIN_TOKEN:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Нет доступа"}, ensure_ascii=False)}

        photo_id = params.get("id")
        body = json.loads(event.get("body") or "{}")
        caption = body.get("caption", "")

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.gallery_photos SET caption = %s WHERE id = %s", (caption, photo_id))
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"ok": True}, ensure_ascii=False),
        }

    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Method not allowed"})}