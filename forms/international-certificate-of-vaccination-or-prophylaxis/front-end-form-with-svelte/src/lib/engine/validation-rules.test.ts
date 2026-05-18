import { describe, expect, it } from 'vitest';
import { emptyCertificate, emptyEntry } from './types';
import { validateCertificate } from './validation-rules';

function yellowFever(date: string) {
  const entry = emptyEntry(1);
  entry.disease = 'yellow-fever';
  entry.manufacturer = 'Sanofi';
  entry.batchNumber = 'YF-2026-001';
  entry.administeringClinicianSignatureDataUrl = 'data:image/png;base64,abc';
  entry.centreStampImageDataUrl = 'data:image/png;base64,xyz';
  entry.centreStampApplied = 'yes';
  entry.vaccinationDate = date;
  entry.validityStartsOn = addDays(date, 10);
  entry.validityIsLifetime = 'yes';
  return entry;
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

describe('validateCertificate', () => {
  it('passes a clean yellow-fever certificate', () => {
    const cert = emptyCertificate();
    cert.patient.birthDate = '1990-01-01';
    cert.entries = [yellowFever('2026-01-01')];
    const report = validateCertificate(cert);
    expect(report.firedRules).toEqual([]);
    expect(report.overallValid).toBe(true);
  });

  it('fires VAL001 when vaccination date is in the future', () => {
    const cert = emptyCertificate();
    const future = addDays(new Date().toISOString().slice(0, 10), 30);
    cert.entries = [yellowFever(future)];
    expect(validateCertificate(cert).firedRules.some((r) => r.code === 'VAL001')).toBe(true);
  });

  it('fires VAL003 when validity start ≠ vaccination + 10', () => {
    const cert = emptyCertificate();
    const entry = yellowFever('2026-01-01');
    entry.validityStartsOn = '2026-01-05';
    cert.entries = [entry];
    expect(validateCertificate(cert).firedRules.some((r) => r.code === 'VAL003')).toBe(true);
  });

  it('fires VAL005 when manufacturer is missing', () => {
    const cert = emptyCertificate();
    const entry = yellowFever('2026-01-01');
    entry.manufacturer = '';
    cert.entries = [entry];
    expect(validateCertificate(cert).firedRules.some((r) => r.code === 'VAL005')).toBe(true);
  });

  it('fires VAL006 when clinician signature is missing', () => {
    const cert = emptyCertificate();
    const entry = yellowFever('2026-01-01');
    entry.administeringClinicianSignatureDataUrl = '';
    cert.entries = [entry];
    expect(validateCertificate(cert).firedRules.some((r) => r.code === 'VAL006')).toBe(true);
  });

  it('fires VAL007 when centre stamp is missing', () => {
    const cert = emptyCertificate();
    const entry = yellowFever('2026-01-01');
    entry.centreStampImageDataUrl = '';
    entry.centreStampApplied = '';
    cert.entries = [entry];
    expect(validateCertificate(cert).firedRules.some((r) => r.code === 'VAL007')).toBe(true);
  });

  it('fires VAL010 when pregnancy is declared', () => {
    const cert = emptyCertificate();
    cert.declaredPregnancy = 'yes';
    cert.entries = [yellowFever('2026-01-01')];
    expect(validateCertificate(cert).firedRules.some((r) => r.code === 'VAL010')).toBe(true);
  });

  it('fires VAL012 when neither language is English or French', () => {
    const cert = emptyCertificate();
    cert.primaryLanguageAsBcp47 = 'es';
    cert.secondaryLanguageAsBcp47 = 'pt';
    cert.entries = [yellowFever('2026-01-01')];
    expect(validateCertificate(cert).firedRules.some((r) => r.code === 'VAL012')).toBe(true);
  });
});
