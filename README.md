Dockerfile Justification:
	Use python:3.9-slim -> smaller image size
	Dependency caching -> faster builds
	Non-root user -> more secure
	Multiple workers -> improved concurrency/throughput
----------------------------------------------------------------------------------------
DockerComposefile Justification:
	Simplifies service orchestration
	Use lightweight and fast Alpine images
	Explicit dependency management
----------------------------------------------------------------------------------------
CI/CD Desgin Justification:
	Use Gitlab CI:
	Multi-stage pipeline -> early failure detection
	Dependency caching -> faster pipeline execution
	Manual deployment gate -> prevents accidental production releases
	Docker-in-Docker isolation -> clean, reproducible builds
	Or
	Use Jenkins:
	Mature ecosystem
	Plugin-based extensible
	Email/Slack alerts
	Enterprise adoption
----------------------------------------------------------------------------------------
Logging Justification:
	Use ELK(Elasticsearch, Logstash, Kibana):
	Centralized -> logging all services in one place
	Full-text search -> fast debugging
	Visualization -> performance monitoring
	Scalability -> production-ready
	Structured logs -> enable filtering
	Industry-standard solution
	Logging Flow:
	FastAPI -> Stdout -> Docker -> Filebeat -> Logstash -> Elasticsearch -> Kibana
----------------------------------------------------------------------------------------
Performance Testing Justification:
	Use k6:
	Lightweight
	Scriptable
	CI/CD compatible
	High-performance load generator
----------------------------------------------------------------------------------------
Performance Optimization Decisions:
	Use multiple Uvicorn workers
	Use slim base image
	Use cached builds
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
Because of blocking js files in email attachment, below is k6-test.js content:
import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  stages: [
	{ duration: '30s', target: 50 },
	{ duration: '1m', target: 100 },
	{ duration: '30s', target: 0 }
  ]
};
export default function () {
  http.get('http://localhost:8000/');
  sleep(1);
}