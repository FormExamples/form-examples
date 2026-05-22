import type { LpaApplication, Signature } from './types.js';

export function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function ageYearsAt(birthDate: string, atDate: string): number | null {
  const dob = parseIsoDate(birthDate);
  const at = parseIsoDate(atDate);
  if (!dob || !at) return null;
  let years = at.getFullYear() - dob.getFullYear();
  const m = at.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < dob.getDate())) {
    years -= 1;
  }
  return years;
}

export function findDonorSignature(app: LpaApplication): Signature | undefined {
  return app.signatures.find((s) => s.signerRole === 'donor');
}

export function findCertificateProviderSignature(app: LpaApplication): Signature | undefined {
  return app.signatures.find((s) => s.signerRole === 'certificate-provider');
}

export function findAttorneySignatures(app: LpaApplication): Signature[] {
  return app.signatures.filter((s) => s.signerRole === 'attorney');
}

export function findReplacementAttorneySignatures(app: LpaApplication): Signature[] {
  return app.signatures.filter((s) => s.signerRole === 'replacement-attorney');
}

export function signatureSignedAt(sig: Signature | undefined): Date | null {
  if (!sig) return null;
  return parseIsoDate(sig.signedAt);
}

export function isSignedBefore(a: Signature | undefined, b: Signature | undefined): boolean {
  const da = signatureSignedAt(a);
  const db = signatureSignedAt(b);
  if (!da || !db) return false;
  return da.getTime() <= db.getTime();
}
