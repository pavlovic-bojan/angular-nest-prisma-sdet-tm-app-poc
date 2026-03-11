/**
 * API Request Module for k6 - Task Manager API
 * Reusable API request functions for Task Manager endpoints
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { getConfig } from './config.js';

/**
 * GET / - Health check (returns "Hello World!")
 * @returns {Object} Response object
 */
export function getHealth() {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.health}`;

  const response = http.get(url, {
    headers: { Accept: '*/*' },
    tags: { endpoint: 'health', method: 'GET' },
  });

  check(response, {
    'health - status is 200': (r) => r.status === 200,
    'health - response time < 2s': (r) => r.timings.duration < 2000,
    'health - has Hello World': (r) => r.body && r.body.includes('Hello World'),
  });

  return response;
}

/**
 * POST /auth/login - Demo login
 * @returns {Object} Response object
 */
export function postLogin() {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.login}`;
  const payload = JSON.stringify(config.loginPayload);

  const response = http.post(url, payload, {
    headers: config.headers,
    tags: { endpoint: 'auth/login', method: 'POST' },
  });

  check(response, {
    'login - status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'login - response time < 3s': (r) => r.timings.duration < 3000,
    'login - has user email': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data && data.email === config.loginPayload.email;
      } catch {
        return false;
      }
    },
  });

  return response;
}

/**
 * GET /users - List users (no auth)
 * @returns {Object} Response object
 */
export function getUsers() {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.users}`;

  const response = http.get(url, {
    headers: config.headers,
    tags: { endpoint: 'users', method: 'GET' },
  });

  check(response, {
    'users - status is 200': (r) => r.status === 200,
    'users - response time < 2s': (r) => r.timings.duration < 2000,
    'users - returns array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });

  return response;
}

/**
 * GET /projects - List projects (no auth)
 * @returns {Object} Response object
 */
export function getProjects() {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.projects}`;

  const response = http.get(url, {
    headers: config.headers,
    tags: { endpoint: 'projects', method: 'GET' },
  });

  check(response, {
    'projects - status is 200': (r) => r.status === 200,
    'projects - response time < 2s': (r) => r.timings.duration < 2000,
    'projects - returns array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });

  return response;
}

/**
 * GET /tasks - List tasks (no auth)
 * @returns {Object} Response object
 */
export function getTasks() {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.tasks}`;

  const response = http.get(url, {
    headers: config.headers,
    tags: { endpoint: 'tasks', method: 'GET' },
  });

  check(response, {
    'tasks - status is 200': (r) => r.status === 200,
    'tasks - response time < 2s': (r) => r.timings.duration < 2000,
    'tasks - returns array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });

  return response;
}

/**
 * Simulate user think time
 */
export function thinkTime(min = 0.5, max = 1.5) {
  sleep(Math.random() * (max - min) + min);
}
