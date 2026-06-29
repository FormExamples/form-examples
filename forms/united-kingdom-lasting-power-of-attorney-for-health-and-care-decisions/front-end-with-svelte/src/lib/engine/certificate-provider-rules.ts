import type { FiredRule, LpaApplication } from './types.js';

export function applyCertificateProviderRules(app: LpaApplication): FiredRule[] {
  const fired: FiredRule[] = [];
  const cp = app.certificateProvider;

  if (!cp) {
    fired.push({
      ruleId: 'R-MCA-CP-PRESENT',
      severity: 'fatal',
      ruleFamily: 'certificate-provider',
      sourceCitation: 'LPA Regs 2007 Sch.1 Pt.2',
      description: 'No certificate provider has been linked to this LPA.',
      suggestedCorrection: 'Nominate an eligible certificate provider on LP1H s.10.',
    });
    return fired;
  }

  if (cp.declaredNotFamily !== 'yes') {
    fired.push({
      ruleId: 'R-MCA-CP-FAM',
      severity: 'fatal',
      ruleFamily: 'certificate-provider',
      sourceCitation: 'LPA Regs 2007 Sch.1 Pt.2',
      description: 'Certificate provider has not declared they are not a family member of the donor or any attorney.',
      suggestedCorrection: 'Choose a certificate provider who is not a family member, or have them complete the declaration.',
    });
  }

  if (cp.declaredNotEmployee !== 'yes') {
    fired.push({
      ruleId: 'R-MCA-CP-EMP',
      severity: 'fatal',
      ruleFamily: 'certificate-provider',
      sourceCitation: 'LPA Regs 2007 Sch.1 Pt.2',
      description: 'Certificate provider has not declared they are not a business partner or employee of the donor or any attorney.',
      suggestedCorrection: 'Choose a certificate provider with no business connection to the donor or attorneys.',
    });
  }

  if (cp.declaredNotAttorney !== 'yes') {
    fired.push({
      ruleId: 'R-MCA-CP-ATT',
      severity: 'fatal',
      ruleFamily: 'certificate-provider',
      sourceCitation: 'LPA Regs 2007 Sch.1 Pt.2',
      description: 'Certificate provider has not declared they are not an attorney named in this LPA.',
      suggestedCorrection: 'The certificate provider cannot also be an attorney; choose someone else.',
    });
  }

  if (cp.route === 'skill-based') {
    if (cp.profession === '') {
      fired.push({
        ruleId: 'R-MCA-CP-ROUTE',
        severity: 'fatal',
        ruleFamily: 'certificate-provider',
        sourceCitation: 'LPA Regs 2007 Sch.1 Pt.2',
        description: 'Skill-based certificate provider is missing a registered profession.',
        suggestedCorrection: 'Choose the certificate provider’s registered profession (e.g. solicitor, GP, registered nurse).',
      });
    }
    if (!cp.professionRegistrationNumber.trim()) {
      fired.push({
        ruleId: 'R-MCA-CP-REGISTRATION',
        severity: 'high',
        ruleFamily: 'certificate-provider',
        sourceCitation: 'OPG guidance',
        description: 'Skill-based certificate provider should record a professional registration number.',
        suggestedCorrection: 'Enter the certificate provider’s SRA, GMC, NMC, HCPC, or equivalent registration number.',
      });
    }
  } else if (cp.route === 'knowledge-based') {
    if (cp.yearsKnownDonor === null || cp.yearsKnownDonor < 2) {
      fired.push({
        ruleId: 'R-MCA-CP-ROUTE',
        severity: 'fatal',
        ruleFamily: 'certificate-provider',
        sourceCitation: 'LPA Regs 2007 Sch.1 Pt.2',
        description: 'Knowledge-based certificate provider must have known the donor personally for at least 2 years.',
        suggestedCorrection: 'Either confirm 2+ years of personal acquaintance or switch to the skill-based route.',
      });
    }
  } else {
    fired.push({
      ruleId: 'R-MCA-CP-ROUTE',
      severity: 'fatal',
      ruleFamily: 'certificate-provider',
      sourceCitation: 'LPA Regs 2007 Sch.1 Pt.2',
      description: 'Certificate provider eligibility route (skill-based or knowledge-based) has not been set.',
      suggestedCorrection: 'Select either the skill-based or knowledge-based eligibility route.',
    });
  }

  return fired;
}
