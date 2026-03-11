/**
 * Smoke Test - Task Manager API
 * Validates basic system stability under minimal load.
 * - Health check (GET /)
 * - Login (POST /auth/login)
 * - Users, projects, tasks (GET)
 * 1 VU, 3 iterations, ~1 min
 */

import { check } from 'k6';
import { getConfig, getThresholds } from '../lib/config.js';
export { handleSummary } from '../lib/summary.js';
import { getHealth, postLogin, getUsers, getProjects, getTasks, thinkTime } from '../lib/api.js';
import { getScenarioConfig, getScenarioName } from '../lib/scenarios.js';

const testType = 'smoke';
const config = getConfig();
const thresholds = getThresholds(testType);

export const options = {
  scenarios: {
    [getScenarioName(testType)]: getScenarioConfig(testType, {
      vus: parseInt(__ENV.VUS) || 1,
      iterations: parseInt(__ENV.ITERATIONS) || 3,
    }),
  },
  thresholds,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

export default function () {
  const healthRes = getHealth();
  check(healthRes, {
    'smoke - health accessible': (r) => r.status === 200,
    'smoke - health response time < 2s': (r) => r.timings.duration < 2000,
  });

  thinkTime(0.3, 0.8);

  const loginRes = postLogin();
  check(loginRes, { 'smoke - login accessible': (r) => r.status === 200 || r.status === 201 });

  thinkTime(0.2, 0.5);

  const usersRes = getUsers();
  check(usersRes, { 'smoke - users accessible': (r) => r.status === 200 });

  const projectsRes = getProjects();
  check(projectsRes, { 'smoke - projects accessible': (r) => r.status === 200 });

  const tasksRes = getTasks();
  check(tasksRes, { 'smoke - tasks accessible': (r) => r.status === 200 });
}

export function setup() {
  console.log(`[SMOKE] Starting against: ${config.baseUrl}`);
  return {};
}

export function teardown() {
  console.log(`[SMOKE] Completed`);
}
