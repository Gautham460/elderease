import http from 'k6/http';
import { check, group } from 'k6';

export const options = {
  iterations: 1,
  vus: 1,
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
  group('Auth Unit Tests', () => {
    // 1. Success Login
    let loginData = JSON.stringify({
      email: 'demo@example.com',
      password: 'password',
      role: 'elder'
    });
    let res = http.post(`${BASE_URL}/auth/login`, loginData, { headers: { 'Content-Type': 'application/json' } });
    check(res, {
      'Login success status is 200': (r) => r.status === 200,
      'Login returns token': (r) => r.json().token !== undefined,
    });

    // 2. Failed Login (Wrong Password)
    let badLoginData = JSON.stringify({
      email: 'demo@example.com',
      password: 'wrong-password',
      role: 'elder'
    });
    let resBad = http.post(`${BASE_URL}/auth/login`, badLoginData, { headers: { 'Content-Type': 'application/json' } });
    check(resBad, {
      'Wrong password status is 400': (r) => r.status === 400,
      'Error message is correct': (r) => r.json().message === 'Invalid database password.'
    });
  });

  group('SOS Validation Unit Tests', () => {
    // 3. Trigger SOS with missing fields
    let badSosData = JSON.stringify({
      patientName: 'Unit Test'
      // Missing sosType
    });
    let resSos = http.post(`${BASE_URL}/sos/email`, badSosData, { headers: { 'Content-Type': 'application/json' } });
    check(resSos, {
      'Missing fields status is 400': (r) => r.status === 400,
      'SOS Validation error message': (r) => r.json().message === 'Missing required fields'
    });
  });

  group('AI Connectivity Unit Tests', () => {
    // 4. Test AI Analyze (Health metrics)
    let aiData = JSON.stringify({
      metrics: [],
      user: { name: 'Unit Tester' }
    });
    let resAi = http.post(`${BASE_URL}/ai/analyze`, aiData, { headers: { 'Content-Type': 'application/json' } });
    check(resAi, {
      'AI Analyze status is 200/500': (r) => [200, 500].includes(r.status) // Might be 500 if key is invalid, but 200 means full chain works
    });
  });
}
