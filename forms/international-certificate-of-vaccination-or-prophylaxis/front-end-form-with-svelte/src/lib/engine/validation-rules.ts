import type { Certificate, FiredRule, PerEntryValidity, ValidationReport } from './types';

function addDays(yyyymmdd: string, days: number): string {
  const d = new Date(`${yyyymmdd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function monthsBetween(start: string, end: string): number {
  const a = new Date(`${start}T00:00:00Z`);
  const b = new Date(`${end}T00:00:00Z`);
  return (
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
    (b.getUTCMonth() - a.getUTCMonth())
  );
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function validateCertificate(cert: Certificate): ValidationReport {
  const fired: FiredRule[] = [];
  const perEntry: PerEntryValidity[] = [];
  const today = todayIso();

  // VAL012 — primary + secondary language must include English or French.
  const langs = [cert.primaryLanguageAsBcp47, cert.secondaryLanguageAsBcp47];
  if (!langs.some((l) => l.startsWith('en') || l.startsWith('fr'))) {
    fired.push({
      code: 'VAL012',
      severity: 'error',
      message: 'Certificate languages must include English or French (IHR Annex 6).',
    });
  }

  for (const entry of cert.entries) {
    const label = `entry ${entry.entryIndex}`;

    // VAL001 — vaccination date not in the future
    if (entry.vaccinationDate && entry.vaccinationDate > today) {
      fired.push({ code: 'VAL001', severity: 'error', message: `${label}: vaccination date is in the future.` });
    }

    // VAL002 — validity start >= vaccination date
    if (
      entry.vaccinationDate &&
      entry.validityStartsOn &&
      entry.validityStartsOn < entry.vaccinationDate
    ) {
      fired.push({ code: 'VAL002', severity: 'error', message: `${label}: validity start is before vaccination date.` });
    }

    // VAL003 — yellow-fever validity start = vaccination + 10 days
    if (entry.disease === 'yellow-fever' && entry.vaccinationDate && entry.validityStartsOn) {
      const expected = addDays(entry.vaccinationDate, 10);
      if (entry.validityStartsOn !== expected) {
        fired.push({
          code: 'VAL003',
          severity: 'error',
          message: `${label}: yellow-fever validity start must equal vaccination date + 10 days.`,
        });
      }
    }

    // VAL004 — yellow-fever validity end overridden to lifetime when blank
    if (
      entry.disease === 'yellow-fever' &&
      !entry.validityEndsOn &&
      entry.validityIsLifetime !== 'yes'
    ) {
      fired.push({
        code: 'VAL004',
        severity: 'warning',
        message: `${label}: yellow-fever validity end overridden to lifetime per 2016 IHR amendment.`,
      });
    }

    // VAL005 — manufacturer + batch required
    if (!entry.manufacturer || !entry.batchNumber) {
      fired.push({ code: 'VAL005', severity: 'error', message: `${label}: manufacturer and batch number are required.` });
    }

    // VAL006 — clinician signature must be present
    if (!entry.administeringClinicianSignatureDataUrl) {
      fired.push({
        code: 'VAL006',
        severity: 'error',
        message: `${label}: handwritten clinician signature is required (stamps are not acceptable).`,
      });
    }

    // VAL007 — centre stamp required
    if (!entry.centreStampImageDataUrl && entry.centreStampApplied !== 'yes') {
      fired.push({ code: 'VAL007', severity: 'error', message: `${label}: official centre stamp is required.` });
    }

    // VAL008 / VAL009 — yellow-fever age window
    if (entry.disease === 'yellow-fever' && cert.patient.birthDate && entry.vaccinationDate) {
      const months = monthsBetween(cert.patient.birthDate, entry.vaccinationDate);
      if (months < 9) {
        fired.push({
          code: 'VAL008',
          severity: 'warning',
          message: `${label}: vaccinee is younger than 9 months; yellow-fever vaccination is contraindicated.`,
        });
      }
      if (months / 12 > 60) {
        fired.push({
          code: 'VAL009',
          severity: 'warning',
          message: `${label}: vaccinee is older than 60 years; yellow-fever vaccination needs clinician review.`,
        });
      }
    }

    perEntry.push({
      entryIndex: entry.entryIndex,
      validFrom: entry.validityStartsOn,
      validUntil: entry.validityIsLifetime === 'yes' || !entry.validityEndsOn ? 'lifetime' : entry.validityEndsOn,
    });
  }

  // VAL010 — declared pregnancy/breastfeeding
  if (cert.declaredPregnancy === 'yes' || cert.declaredBreastfeeding === 'yes') {
    fired.push({
      code: 'VAL010',
      severity: 'warning',
      message: 'Vaccinee declared pregnancy or breastfeeding; yellow-fever vaccination is contraindicated.',
    });
  }
  // VAL011 — declared immunosuppression
  if (cert.declaredImmunosuppression === 'yes') {
    fired.push({
      code: 'VAL011',
      severity: 'warning',
      message: 'Vaccinee declared immunosuppression; yellow-fever vaccination is contraindicated.',
    });
  }

  return {
    validityComputedAt: new Date().toISOString(),
    overallValid: fired.every((r) => r.severity !== 'error'),
    firedRules: fired,
    perEntryValidity: perEntry,
  };
}
