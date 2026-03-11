/**
 * Spike Test - Task Manager API
 * Minimal spike: 2 -> 4 -> 2 VUs, ~1 min
 */

import { check } from 'k6';
import { getConfig, getThresholds } from '../lib/config.js';
export { handleSummary } from '../lib/summary.js';
import { getHealth, postLogin, getUsers, getProjects, getTasks, thinkTime } from '../lib/api.js';
import { getScenarioConfig, getScenarioName } from '../lib/scenarios.js';

const testType = 'spike';
const config = getConfig();
const thresholds = getThresholds(testType);

export const options = {
  scenarios: {
    [getScenarioName(testType)]: getScenarioConfig(testType),
  },
  thresholds,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

export default function () {
  const healthRes = getHealth();
  check(healthRes, { 'spike - health 200': (r) => r.status === 200 });
  thinkTime(0.2, 0.6);

  postLogin();
  thinkTime(0.2, 0.5);

  const usersRes = getUsers();
  check(usersRes, { 'spike - users 200': (r) => r.status === 200 });

  const projectsRes = getProjects();
  check(projectsRes, { 'spike - projects 200': (r) => r.status === 200 });

  const tasksRes = getTasks();
  check(tasksRes, { 'spike - tasks 200': (r) => r.status === 200 });
}

export function setup() {
  console.log(`[SPIKE] Starting: ${config.baseUrl}`);
  return {};
}

export function teardown() {
  console.log(`[SPIKE] Completed`);
}
