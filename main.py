import os
import logging
import redis
from fastapi import FastAPI, HTTPException, Request
from pythonjsonlogger import jsonlogger

app = FastAPI()

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", "6379")),
    db=0,
)

# -------- Logging --------
logHandler = logging.FileHandler("/var/log/app/app.log")
formatter = jsonlogger.JsonFormatter("%(asctime)s %(levelname)s %(name)s %(message)s")
logHandler.setFormatter(formatter)
logger = logging.getLogger("fastapi-app")
logger.setLevel(logging.INFO)
logger.addHandler(logHandler)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    client = request.client.host if request.client else "unknown"
    logger.info("request_received", extra={"method": request.method, "path": request.url.path, "client": client})
    response = await call_next(request)
    logger.info("response_sent", extra={"status_code": response.status_code})
    return response


# -------- App --------
@app.get("/")
def read_root():
    value = redis_client.get("example_key")
    if value is None:
        logger.warning("redis_key_not_found", extra={"key": "example_key"})
        raise HTTPException(status_code=404, detail="Key not found")
    logger.info("redis_key_read", extra={"key": "example_key"})
    return {"message": value}


@app.post("/write/{key}")
def write_to_redis(key: str, value: str):
    redis_client.set(key, value)
    logger.info("redis_key_written", extra={"key": key})
    return {"message": f"Key '{key}' set to '{value}'"}
