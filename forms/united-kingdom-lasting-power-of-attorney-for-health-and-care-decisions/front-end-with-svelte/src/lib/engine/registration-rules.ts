import type { FiredRule, LpaApplication } from './types.js';

export function applyRegistrationRules(app: LpaApplication): FiredRule[] {
  const fired: FiredRule[] = [];
  const reg = app.registration;

  if (app.peopleToNotify.length > 5) {
    fired.push({
      ruleId: 'R-MCA-NOTIFY-MAX',
      severity: 'fatal',
      ruleFamily: 'registration',
      sourceCitation: 'LPA Regs 2007',
      description: `Too many persons to notify: ${app.peopleToNotify.length}; maximum is 5.`,
      suggestedCorrection: 'List no more than five persons to notify on LP1H s.6.',
    });
  }

  if (reg.applicantRole === '') {
    fired.push({
      ruleId: 'R-MCA-REG-APPLICANT',
      severity: 'fatal',
      ruleFamily: 'registration',
      sourceCitation: 'LPA Regs 2007 reg.6',
      description: 'The applicant for registration has not been identified.',
      suggestedCorrection: 'Select whether the donor, one attorney, or all attorneys jointly are applying to register.',
    });
  }

  if (!reg.applicantSignedAt) {
    fired.push({
      ruleId: 'R-MCA-REG-SIGNED',
      severity: 'fatal',
      ruleFamily: 'registration',
      sourceCitation: 'LPA Regs 2007 reg.6',
      description: 'The applicant has not signed Part C of LP1H.',
      suggestedCorrection: 'The applicant must sign and date Part C before the LPA is sent to the OPG.',
    });
  }

  const remissionCovers = reg.feeRemission === 'half' || reg.feeRemission === 'full-exempt';
  if (reg.feeAmountPounds <= 0 && !remissionCovers) {
    fired.push({
      ruleId: 'R-MCA-FEE',
      severity: 'fatal',
      ruleFamily: 'registration',
      sourceCitation: 'LPA Regs 2007 reg.6',
      description: 'No registration fee recorded and no remission or exemption indicated.',
      suggestedCorrection: 'Record the registration fee (currently £82) or indicate the basis for remission or exemption.',
    });
  }

  if (reg.feeRemission !== '' && reg.feeRemission !== 'none' && !reg.feeRemissionReason) {
    fired.push({
      ruleId: 'R-MCA-FEE-REASON',
      severity: 'high',
      ruleFamily: 'registration',
      sourceCitation: 'LPA Regs 2007 reg.6',
      description: 'Fee remission claimed without a stated reason.',
      suggestedCorrection: 'Select the statutory basis for the remission or exemption claim.',
    });
  }

  return fired;
}
