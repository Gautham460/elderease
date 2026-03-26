import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // ramp up to 20 users
    { duration: '1m', target: 20 },  // stay at 20 users
    { duration: '30s', target: 0 },  // ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
  // Test health check route
  let res = http.get('http://localhost:5000/');
  check(res, { 'status is 200': (r) => r.status === 200 });

  // Test getting appointments (using the demo patient ID I found earlier)
  let patientId = '69be211c3bfb69edd21c330e';
  res = http.get(`${BASE_URL}/healthcare/appointments/${patientId}`);
  check(res, { 
    'appointments status is 200': (r) => r.status === 200,
    'got appointments list': (r) => r.json().length >= 0
  });

  // Test getting medication orders
  res = http.get(`${BASE_URL}/healthcare/orders/${patientId}`);
  check(res, { 'orders status is 200': (r) => r.status === 200 });

  sleep(1);
}
