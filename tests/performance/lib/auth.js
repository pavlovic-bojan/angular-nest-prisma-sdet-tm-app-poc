/**
 * Authentication Module for k6 - Task Manager API
 * Task Manager uses POST /auth/login (returns user directly, no JWT).
 * This module provides request params for consistency with other tests.
 */

import { getConfig } from './config.js';

/**
 * Get standard request headers
 * @returns {Object} Headers object
 */
export function getAuthHeaders() {
  const config = getConfig();
  return { ...config.headers };
}

/**
 * Get request params for API calls
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Request params with headers
 */
export function getRequestParams(additionalHeaders = {}) {
  return {
    headers: {
      ...getAuthHeaders(),
      ...additionalHeaders,
    },
    tags: { name: 'TM_API' },
  };
}
