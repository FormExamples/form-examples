// Certificate-provider rule family.

(function () {
'use strict';
window.UkLpaForm = window.UkLpaForm || {};

function applyCertificateProviderRules(app) {
  const fired = [];
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
      description: 'Certificate provider has not declared they are not a family member.',
      suggestedCorrection: 'Choose someone who is not a family member of the donor or attorneys.',
    });
  }
  if (cp.declaredNotEmployee !== 'yes') {
    fired.push({
      ruleId: 'R-MCA-CP-EMP',
      severity: 'fatal',
      ruleFamily: 'certificate-provider',
      sourceCitation: 'LPA Regs 2007 Sch.1 Pt.2',
      description: 'Certificate provider has not declared they are not a business partner or employee.',
      suggestedCorrection: 'Choose someone with no business connection to the donor or attorneys.',
    });
  }
  if (cp.declaredNotAttorney !== 'yes') {
    fired.push({
      ruleId: 'R-MCA-CP-ATT',
      severity: 'fatal',
      ruleFamily: 'certificate-provider',
      sourceCitation: 'LPA Regs 2007 Sch.1 Pt.2',
      description: 'Certificate provider has not declared they are not an attorney in this LPA.',
      suggestedCorrection: 'The certificate provider cannot also be an attorney.',
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
        suggestedCorrection: 'Choose the certificate provider’s registered profession.',
      });
    }
    if (!(cp.professionRegistrationNumber || '').trim()) {
      fired.push({
        ruleId: 'R-MCA-CP-REGISTRATION',
        severity: 'high',
        ruleFamily: 'certificate-provider',
        sourceCitation: 'OPG guidance',
        description: 'Skill-based certificate provider should record a professional registration number.',
        suggestedCorrection: 'Enter the SRA, GMC, NMC, HCPC, or equivalent registration number.',
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
      description: 'Certificate provider eligibility route has not been set.',
      suggestedCorrection: 'Select either the skill-based or knowledge-based eligibility route.',
    });
  }

  return fired;
}

window.UkLpaForm.applyCertificateProviderRules = applyCertificateProviderRules;
})();
