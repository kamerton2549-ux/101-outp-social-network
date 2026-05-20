"""
Загрузка фото участника в S3.
POST / — принимает base64-изображение, сохраняет в S3, возвращает CDN-URL.
"""
import json
import os
import base64
import uuid
import boto3

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_SIZE_MB = 5


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Method not allowed"})}

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Invalid JSON"})}

    data_url = body.get("image", "")
    if not data_url:
        return {
            "statusCode": 400,
            "headers": CORS,
            "body": json.dumps({"error": "Поле image обязательно"}, ensure_ascii=False),
        }

    # Парсим data URL: data:image/jpeg;base64,....
    if "," not in data_url:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неверный формат изображения"}, ensure_ascii=False)}

    header, encoded = data_url.split(",", 1)
    # header = "data:image/jpeg;base64"
    content_type = "image/jpeg"
    if ":" in header and ";" in header:
        content_type = header.split(":")[1].split(";")[0].strip()

    if content_type not in ALLOWED_TYPES:
        return {
            "statusCode": 400,
            "headers": CORS,
            "body": json.dumps({"error": "Допустимые форматы: JPG, PNG, WEBP"}, ensure_ascii=False),
        }

    try:
        image_bytes = base64.b64decode(encoded)
    except Exception:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Ошибка декодирования изображения"}, ensure_ascii=False)}

    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        return {
            "statusCode": 400,
            "headers": CORS,
            "body": json.dumps({"error": f"Файл слишком большой. Максимум {MAX_SIZE_MB} МБ"}, ensure_ascii=False),
        }

    ext = content_type.split("/")[1]
    if ext == "jpeg":
        ext = "jpg"
    filename = f"members/{uuid.uuid4().hex}.{ext}"

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    s3.put_object(
        Bucket="files",
        Key=filename,
        Body=image_bytes,
        ContentType=content_type,
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{filename}"

    return {
        "statusCode": 200,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"url": cdn_url}, ensure_ascii=False),
    }
