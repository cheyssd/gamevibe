import http from 'k6/http';
import { check, sleep } from 'k6';


export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Montée progressive à 10 utilisateurs
    { duration: '1m',  target: 50 },  // Maintien à 50 utilisateurs pendant 1 min
    { duration: '30s', target: 100 }, // Pic à 100 utilisateurs
    { duration: '30s', target: 0 },   // Descente progressive
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% des requêtes < 2 secondes
    http_req_failed: ['rate<0.05'],    // Taux d'erreur < 5%
  },
};

const BASE_URL = 'https://gamevibe-production.up.railway.app/api';

export default function () {

  // Test 1 — Liste des jeux (endpoint le plus sollicité)
  const jeuxRes = http.get(`${BASE_URL}/jeux`);
  check(jeuxRes, {
    'GET /api/jeux — status 200': (r) => r.status === 200,
    'GET /api/jeux — temps < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);

  // Test 2 — Stats globales (utilisé par la Home)
  const statsRes = http.get(`${BASE_URL}/admin/stats`);
  check(statsRes, {
    'GET /api/admin/stats — status 200': (r) => r.status === 200,
    'GET /api/admin/stats — temps < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);

  // Test 3 — Liste des catégories
  const catsRes = http.get(`${BASE_URL}/categories`);
  check(catsRes, {
    'GET /api/categories — status 200': (r) => r.status === 200,
  });

  sleep(1);

  // Test 4 — Liste des plateformes
  const platsRes = http.get(`${BASE_URL}/plateformes`);
  check(platsRes, {
    'GET /api/plateformes — status 200': (r) => r.status === 200,
  });

  sleep(1);
}