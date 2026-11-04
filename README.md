**What is it?**  
A small "FastAPI + Redis" sample service with a full DevOps pipeline around it.  
It’s mostly a template for the workflow: lint, build a container, deploy, load test, and log in JSON.

**How to Run?**  
docker compose up --build -d, then:  
curl -X POST "http://localhost:8000/write/example_key?value=hello"  
curl http://localhost:8000/
