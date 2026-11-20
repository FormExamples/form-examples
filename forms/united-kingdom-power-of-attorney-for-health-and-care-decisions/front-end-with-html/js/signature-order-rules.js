import { findAttorneySignatures, findCertificateProviderSignature, findDonorSignature, isSignedBefore, signatureSignedAt } from './utils.js';

// Signature-order rule family.

function applySignatureOrderRules(app) {
  const fired = [];
  const donorSig = findDonorSignature(app);
  const cpSig = findCertificateProviderSignature(app);
  const attSigs = findAttorneySignatures(app);

  if (!donorSig || !signatureSignedAt(donorSig)) {
    fired.push({
      ruleId: 'R-MCA-SIG-DONOR',
      severity: 'fatal',
      ruleFamily: 'signature-order',
      sourceCitation: 'LP1H s.9',
      description: 'Donor has not signed the LPA.',
      suggestedCorrection: 'Capture the donor’s signature and dated witness statement on LP1H s.9.',
    });
  }

  if (!cpSig || !signatureSignedAt(cpSig)) {
    fired.push({
      ruleId: 'R-MCA-SIG-CP',
      severity: 'fatal',
      ruleFamily: 'signature-order',
      sourceCitation: 'LP1H s.10',
      description: 'Certificate provider has not signed the LPA.',
      suggestedCorrection: 'The certificate provider must sign LP1H s.10 before the attorneys.',
    });
  }

  if (attSigs.length === 0 || attSigs.some((s) => !signatureSignedAt(s))) {
    fired.push({
      ruleId: 'R-MCA-SIG-ATT-ALL',
      severity: 'fatal',
      ruleFamily: 'signature-order',
      sourceCitation: 'LP1H s.11',
      description: 'Not every named attorney has signed and dated the LPA.',
      suggestedCorrection: 'Every attorney must sign LP1H s.11 after the donor and certificate provider.',
    });
  }

  if (donorSig && cpSig && !isSignedBefore(donorSig, cpSig)) {
    fired.push({
      ruleId: 'R-MCA-ORDER-DONOR-FIRST',
      severity: 'fatal',
      ruleFamily: 'signature-order',
      sourceCitation: 'LPA Regs 2007 Sch.1',
      description: 'Donor must sign before the certificate provider.',
      suggestedCorrection: 'The donor signs first, then the certificate provider, then the attorneys.',
    });
  }

  if (cpSig) {
    for (const a of attSigs) {
      if (!isSignedBefore(cpSig, a)) {
        fired.push({
          ruleId: 'R-MCA-ORDER-CP-BEFORE-ATT',
          severity: 'fatal',
          ruleFamily: 'signature-order',
          sourceCitation: 'LPA Regs 2007 Sch.1',
          description: 'Certificate provider must sign before any attorney.',
          suggestedCorrection: 'Ensure the certificate-provider signature date precedes every attorney signature date.',
        });
        break;
      }
    }
  }

  for (const sig of app.signatures) {
    if (sig.witnessIsAttorney === 'yes') {
      fired.push({
        ruleId: 'R-MCA-WIT-NOT-ATT',
        severity: 'fatal',
        ruleFamily: 'signature-order',
        sourceCitation: 'LPA Regs 2007 Sch.1',
        description: 'A signature witness must not be an attorney named in this LPA.',
        suggestedCorrection: 'Choose a witness who is not an attorney.',
      });
      break;
    }
  }

  if (donorSig) {
    const fullName = `${app.donor.givenNames} ${app.donor.familyName}`.trim().toLowerCase();
    if (donorSig.witnessName.trim() !== '' && donorSig.witnessName.trim().toLowerCase() === fullName) {
      fired.push({
        ruleId: 'R-MCA-WIT-NOT-DONOR',
        severity: 'fatal',
        ruleFamily: 'signature-order',
        sourceCitation: 'LPA Regs 2007 Sch.1',
        description: 'The witness on the donor’s signature appears to be the donor themselves.',
        suggestedCorrection: 'Choose an independent witness for the donor’s signature.',
      });
    }
  }

  return fired;
}

export { applySignatureOrderRules };
