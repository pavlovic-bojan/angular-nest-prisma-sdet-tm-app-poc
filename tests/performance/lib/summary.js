/**
 * k6 HTML Report - uses benc-uk/k6-reporter
 * Output: k6-report/index.html
 */
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/3.0.1/dist/bundle.js';

export function handleSummary(data) {
  return {
    'k6-report/index.html': htmlReport(data, {
      title: `Task Manager Load Test ${new Date().toISOString().slice(0, 10)}`,
    }),
  };
}
