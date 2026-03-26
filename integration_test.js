import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  vus: 1, // Only 1 virtual user for pure integration testing (functional check)
  iterations: 1,
};

const BASE_URL = 'http://localhost:5000/api';
const PATIENT_ID = '69be211c3bfb69edd21c330e';

export default function () {
  group('1. Profile and Data Fetching', () => {
    let res = http.get(`${BASE_URL}/user-data/${PATIENT_ID}`);
    check(res, {
      'Fetch status is 200': (r) => r.status === 200,
      'Data has correct userId': (r) => r.json().userId === PATIENT_ID
    });
  });

  group('2. Record Health Metric (PATCH)', () => {
    const payload = JSON.stringify({
      metrics: [
        {
          id: 'k6-test-metric',
          type: 'heart_rate',
          value: 85,
          unit: 'bpm',
          timestamp: new Date().toISOString(),
          status: 'normal'
        }
      ]
    });
    const params = { headers: { 'Content-Type': 'application/json' } };
    let res = http.patch(`${BASE_URL}/user-data/${PATIENT_ID}`, payload, params);
    check(res, {
      'Patch status is 200': (r) => r.status === 200,
      'Metric recorded correctly': (r) => r.json().metrics.find(m => m.id === 'k6-test-metric') !== undefined
    });
  });

  group('3. Emergency SOS Integration', () => {
    const sosPayload = JSON.stringify({
      patientName: 'K6 Test Patient',
      patientEmail: 'demo@example.com',
      sosType: 'manual',
      medicalInfo: { bloodType: 'O+' },
      location: { address: 'Mumbai, India' }
    });
    const params = { headers: { 'Content-Type': 'application/json' } };
    let res = http.post(`${BASE_URL}/sos/email`, sosPayload, params);
    check(res, {
      'SOS status is 200': (r) => r.status === 200,
      'SOS email success': (r) => r.json().success === true
    });
  });

  group('4. Healthcare Provider Lookup', () => {
    let res = http.get(`${BASE_URL}/healthcare/appointments/${PATIENT_ID}`);
    check(res, {
        'Lookup status is 200': (r) => r.status === 200
    });
  });

  sleep(1);
}
