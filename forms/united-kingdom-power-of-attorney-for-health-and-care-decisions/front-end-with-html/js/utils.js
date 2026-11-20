// Date math and signature lookups, ported from the SvelteKit engine.

function parseIsoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function ageYearsAt(birthDate, atDate) {
  const dob = parseIsoDate(birthDate);
  const at = parseIsoDate(atDate);
  if (!dob || !at) return null;
  let years = at.getFullYear() - dob.getFullYear();
  const m = at.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < dob.getDate())) years -= 1;
  return years;
}

function findDonorSignature(app) {
  return app.signatures.find((s) => s.signerRole === 'donor');
}

function findCertificateProviderSignature(app) {
  return app.signatures.find((s) => s.signerRole === 'certificate-provider');
}

function findAttorneySignatures(app) {
  return app.signatures.filter((s) => s.signerRole === 'attorney');
}

function signatureSignedAt(sig) {
  if (!sig) return null;
  return parseIsoDate(sig.signedAt);
}

function isSignedBefore(a, b) {
  const da = signatureSignedAt(a);
  const db = signatureSignedAt(b);
  if (!da || !db) return false;
  return da.getTime() <= db.getTime();
}

export { parseIsoDate, ageYearsAt, findDonorSignature, findCertificateProviderSignature, findAttorneySignatures, signatureSignedAt, isSignedBefore };
