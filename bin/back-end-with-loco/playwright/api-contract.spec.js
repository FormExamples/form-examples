// Playwright API contract test for any back-end-with-loco crate.
//
// Exercises the canonical JSON API documented in
// AGENTS/back-end-with-loco.md:
//
//   POST  /api/assessments               -> create draft
//   GET   /api/assessments               -> list
//   GET   /api/assessments/{id}          -> read
//   PATCH /api/assessments/{id}          -> deep-merge into data
//   POST  /api/assessments/{id}/submit   -> mark completed
//   GET   /api/assessments/{id}/result   -> return stored result
//   GET   /api/dashboard                 -> list by status
//
// Usage:
//   TARGET_URL=http://localhost:5170 node bin/back-end-with-loco/playwright/api-contract.spec.js

const { request } = require('playwright');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5150';

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERT FAIL: ' + msg);
}

(async () => {
  const api = await request.newContext({ baseURL: TARGET_URL });

  let r = await api.post('/api/assessments');
  assert(r.status() === 200, `create: expected 200, got ${r.status()}`);
  const created = await r.json();
  assert(typeof created.id === 'string' && created.id.length > 0, 'create: missing id');
  assert(created.status === 'in_progress', `create: expected status=in_progress, got ${created.status}`);
  assert(typeof created.data === 'object' && created.data !== null, 'create: missing data');
  console.log(`[1] POST /api/assessments  -> 200, id=${created.id}, status=${created.status}`);

  const id = created.id;

  r = await api.get('/api/assessments');
  assert(r.status() === 200, `list: expected 200, got ${r.status()}`);
  const list = await r.json();
  assert(Array.isArray(list.items), 'list: items not array');
  assert(typeof list.total === 'number', 'list: total not number');
  assert(list.items.some(i => i.id === id), 'list: created id not present');
  console.log(`[2] GET  /api/assessments  -> 200, total=${list.total}, contains created id`);

  r = await api.get(`/api/assessments/${id}`);
  assert(r.status() === 200, `get: expected 200, got ${r.status()}`);
  const got = await r.json();
  assert(got.id === id, `get: id mismatch ${got.id} != ${id}`);
  console.log(`[3] GET  /api/assessments/{id}  -> 200, id matches`);

  const patch = {
    personalInformation: { fullLegalName: 'Test Patient', nhsNumber: '999 999 9999' },
  };
  r = await api.patch(`/api/assessments/${id}`, { data: patch });
  assert(r.status() === 200, `patch: expected 200, got ${r.status()}`);
  const patched = await r.json();
  const pi = patched.data && patched.data.personalInformation;
  assert(pi && pi.fullLegalName === 'Test Patient', `patch: name not merged (${JSON.stringify(pi)})`);
  assert(pi.nhsNumber === '999 999 9999', 'patch: nhs not merged');
  console.log('[4] PATCH /api/assessments/{id}  -> 200, body merged into data');

  r = await api.post(`/api/assessments/${id}/submit`);
  assert(r.status() === 200, `submit: expected 200, got ${r.status()}`);
  const submitted = await r.json();
  assert(submitted.status === 'completed', `submit: expected status=completed, got ${submitted.status}`);
  console.log(`[5] POST /api/assessments/{id}/submit  -> 200, status=${submitted.status}`);

  r = await api.get(`/api/assessments/${id}/result`);
  assert(r.status() === 200, `result: expected 200, got ${r.status()}`);
  const result = await r.json();
  assert(result.id === id, 'result: id mismatch');
  assert('result' in result, 'result: missing result field');
  console.log(`[6] GET  /api/assessments/{id}/result  -> 200, id matches, result=${JSON.stringify(result.result)}`);

  r = await api.get('/api/dashboard');
  assert(r.status() === 200, `dashboard: expected 200, got ${r.status()}`);
  const dash = await r.json();
  assert(Array.isArray(dash.items), 'dashboard: items not array');
  assert(dash.items.some(i => i.id === id), 'dashboard: completed id not present');
  console.log(`[7] GET  /api/dashboard  -> 200, total=${dash.total}, contains completed id`);

  r = await api.get('/api/assessments/00000000-0000-0000-0000-000000000000');
  assert(r.status() === 404, `404 unknown id: expected 404, got ${r.status()}`);
  console.log(`[8] GET  /api/assessments/<bogus>  -> ${r.status()} as expected`);

  await api.dispose();
  console.log('\nALL CHECKS PASSED');
})().catch(e => {
  console.error('FAIL:', e.message);
  process.exit(1);
});
