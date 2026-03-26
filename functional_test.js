import http from 'k6/http';
import { check, group } from 'k6';

export const options = {
  iterations: 1,
  vus: 1,
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
  const uniqueEmail = `k6-user-${Date.now()}@example.com`;

  group('Scenario 1: User Registration & Login', () => {
    // 1. Register new user
    let regPayload = JSON.stringify({
      name: 'Functional Test User',
      email: uniqueEmail,
      password: 'test-password',
      role: 'patient'
    });
    let regRes = http.post(`${BASE_URL}/auth/register`, regPayload, { headers: { 'Content-Type': 'application/json' } });
    check(regRes, {
      'Registration Status is 201': (r) => r.status === 201,
      'User object created': (r) => r.json().user.email === uniqueEmail
    });

    const newUserId = regRes.json().user.id;

    // 2. Login with new user
    let loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
      email: uniqueEmail,
      password: 'test-password',
      role: 'patient'
    }), { headers: { 'Content-Type': 'application/json' } });
    check(loginRes, {
      'Login Status is 200': (r) => r.status === 200
    });

    group('Scenario 2: Medication Management', () => {
      // 3. Add a medication
      let medPayload = JSON.stringify({
        user: newUserId,
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Daily',
        time: '08:00',
        stock: 30,
        status: 'active'
      });
      let medRes = http.post(`${BASE_URL}/medications`, medPayload, { headers: { 'Content-Type': 'application/json' } });
      check(medRes, {
        'Medication Added Status is 201': (r) => r.status === 201,
        'Medication name is correct': (r) => r.json().name === 'Aspirin'
      });

      // 4. Verify medication list
      let listRes = http.get(`${BASE_URL}/medications/${newUserId}`);
      check(listRes, {
        'List contains 1 medication': (r) => r.json().length === 1
      });
    });

    group('Scenario 3: User Data Persistence', () => {
       // 5. Patch blood type
       let patchRes = http.patch(`${BASE_URL}/user-data/${newUserId}`, JSON.stringify({
         medicalInfo: { bloodType: 'B+' }
       }), { headers: { 'Content-Type': 'application/json' } });
       check(patchRes, {
         'Data Patch Status is 200': (r) => r.status === 200,
         'Blood type updated': (r) => r.json().medicalInfo.bloodType === 'B+'
       });
    });
  });
}
