import http from 'k6/http';
import { check } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:8000';

export const options = {
  scenarios: {
    reads: {
      executor: 'ramping-arrival-rate',   // controls requests/sec, not VUs
      exec: 'reads',
      startRate: 50,
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 1000,
      stages: [
        { target: 300,  duration: '1m' },
        { target: 800,  duration: '2m' },
        { target: 1500, duration: '2m' },
        { target: 0,    duration: '30s' },
      ],
    },
    writes: {
      executor: 'constant-arrival-rate',
      exec: 'writes',
      rate: 50,
      timeUnit: '1s',
      duration: '5m30s',
      preAllocatedVUs: 50,
      maxVUs: 200,
    },
  },
  thresholds: {
    http_req_failed:   ['rate<0.01'],             // under 1% errors
    http_req_duration: ['p(95)<200', 'p(99)<500'],
  },
};

// Seed the key so GET / does not return 404 during the test.
export function setup() {
  const res = http.post(`${BASE}/write/example_key?value=hello`);
  check(res, { 'seeded example_key': (r) => r.status === 200 });
}

export function reads() {
  const res = http.get(`${BASE}/`);
  check(res, { 'read 200': (r) => r.status === 200 });
}

export function writes() {
  const key = `load_${__VU}_${__ITER}`;
  const res = http.post(`${BASE}/write/${key}?value=test`);
  check(res, { 'write 200': (r) => r.status === 200 });
}
