/**
 * Soak Test - Task Manager API
 * Minimal soak: 2 req/s, 1 min
 */

import { check } from 'k6';
import { getConfig, getThresholds } from '../lib/config.js';
export { handleSummary } from '../lib/summary.js';
import { getHealth, postLogin, getUsers, getProjects, getTasks, thinkTime } from '../lib/api.js';
import { getScenarioConfig, getScenarioName } from '../lib/scenarios.js';

const testType = 'soak';
const config = getConfig();
const thresholds = getThresholds(testType);

export const options = {
  scenarios: {
    [getScenarioName(testType)]: getScenarioConfig(testType, {
      rate: parseInt(__ENV.RATE) || 2,
      duration: __ENV.DURATION || '1m',
    }),
  },
  thresholds,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

export default function () {
  const healthRes = getHealth();
  check(healthRes, { 'soak - health 200': (r) => r.status === 200 });
  thinkTime(0.2, 0.5);

  postLogin();
  thinkTime(0.2, 0.5);

  const usersRes = getUsers();
  check(usersRes, { 'soak - users 200': (r) => r.status === 200 });

  const projectsRes = getProjects();
  check(projectsRes, { 'soak - projects 200': (r) => r.status === 200 });

  const tasksRes = getTasks();
  check(tasksRes, { 'soak - tasks 200': (r) => r.status === 200 });
}

export function setup() {
  console.log(`[SOAK] Starting: ${config.baseUrl}`);
  return {};
}

export function teardown() {
  console.log(`[SOAK] Completed`);
}
