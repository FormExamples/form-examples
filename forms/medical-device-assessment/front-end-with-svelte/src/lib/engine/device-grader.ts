// Medical device assessment engine: EU MDR 2017/745 Annex VIII (simplified).
// Pure functions, no I/O. Highest class over all fired rules wins (Annex VIII 3.5).
// Ported verbatim from front-end-with-html/js/device-grader.js; behaviour is unchanged.

import { createEngineDefaults } from './defaults';
import type {
  AdditionalFlag,
  ConformityRoute,
  DeviceClass,
  EngineInput,
  FiredRule,
  FlagPriority,
  GradingResult,
  Readiness
} from './types';

const ORDER = ['', 'I', 'IIa', 'IIb', 'III'];
const HIGH_RISK_SITES = ['heart', 'central-circulatory-system', 'central-nervous-system'];
const MINOR_ORIFICE_SITES = ['oral-nasal-ear'];

const yes = (v: string) => v === 'yes';
const rank = (c: string) => ORDER.indexOf(c);

export function gradeDevice(state: Partial<EngineInput>): GradingResult {
  const s: EngineInput = { ...createEngineDefaults(), ...state };
  const firedRules: FiredRule[] = [];
  const flags: AdditionalFlag[] = [];
  const rule = (
    n: number,
    deviceClass: FiredRule['deviceClass'],
    category: string,
    description: string
  ) =>
    firedRules.push({
      ruleId: `R-MDR-${n}-${deviceClass}`,
      annexViiiRule: n,
      deviceClass,
      category,
      description
    });
  const flag = (
    flagId: string,
    category: string,
    priority: FlagPriority,
    description: string,
    suggestedAction: string
  ) => flags.push({ flagId, category, priority, description, suggestedAction });

  const emptyResult = (readiness: Readiness): GradingResult => ({
    computedDeviceClass: '',
    finalDeviceClass: '',
    classSuffix: '',
    overrideReason: '',
    conformityRoute: '',
    determiningRule: '',
    regulatoryReadiness: readiness,
    firedRules,
    additionalFlags: flags
  });

  if (s.intendedPurpose.trim() === '') {
    flag(
      'F-PURPOSE-001',
      'missing-intended-purpose',
      'high',
      'No intended purpose recorded; classification depends on it.',
      'Write the intended purpose before classifying.'
    );
  }
  if (yes(s.isInVitroDiagnostic)) {
    flag(
      'F-IVD-001',
      'in-vitro-diagnostic-out-of-scope',
      'high',
      'In vitro diagnostic devices are classified under IVDR 2017/746, not MDR Annex VIII.',
      'Use the IVDR classification rules.'
    );
    return emptyResult('blocked');
  }
  if (s.deviceKind === '' || s.intendedPurpose.trim() === '') return emptyResult('blocked');

  const hasSoftwarePurpose = s.softwarePurpose !== '' && s.softwarePurpose !== 'none';
  const longTerm =
    s.contactDuration === 'long-term' || s.contactDuration === '' || s.deviceKind === 'implantable';
  const duration = s.deviceKind === 'implantable' ? 'long-term' : s.contactDuration || 'long-term';
  const highRiskSite = HIGH_RISK_SITES.includes(s.bodySite);
  const minorOrifice = MINOR_ORIFICE_SITES.includes(s.bodySite);

  switch (s.deviceKind) {
    case 'non-invasive':
      if (yes(s.channelsOrStoresBodySubstances) && yes(s.connectedToActiveDeviceClassIiaOrHigher)) {
        rule(
          2,
          'IIa',
          'non-invasive',
          'Channels or stores body substances and is connected to a Class IIa or higher active device'
        );
      } else if (yes(s.channelsOrStoresBodySubstances)) {
        rule(
          2,
          'I',
          'non-invasive',
          'Channels or stores body substances, not connected to an active device of Class IIa or higher'
        );
      } else {
        rule(1, 'I', 'non-invasive', 'Non-invasive device, no other rule applies');
      }
      break;
    case 'invasive-body-orifice':
      if (duration === 'transient') rule(5, 'I', 'invasive', 'Transient use via body orifice');
      else if (duration === 'short-term')
        rule(
          5,
          minorOrifice ? 'I' : 'IIa',
          'invasive',
          `Short-term use via body orifice${minorOrifice ? ' (oral, nasal or ear cavity)' : ''}`
        );
      else
        rule(
          5,
          minorOrifice ? 'IIa' : 'IIb',
          'invasive',
          `Long-term use via body orifice${minorOrifice ? ' (oral, nasal or ear cavity)' : ''}`
        );
      break;
    case 'surgically-invasive':
    case 'implantable': {
      const n = duration === 'transient' ? 6 : duration === 'short-term' ? 7 : 8;
      let cls: FiredRule['deviceClass'] =
        duration === 'transient' ? 'IIa' : duration === 'short-term' ? 'IIa' : 'IIb';
      if (duration === 'transient' && yes(s.reusableSurgicalInstrument)) cls = 'I';
      if (highRiskSite) cls = 'III';
      rule(
        n,
        cls,
        s.deviceKind === 'implantable' ? 'implantable' : 'invasive',
        `${s.deviceKind === 'implantable' ? 'Implantable' : 'Surgically invasive'}, ${duration}${highRiskSite ? ', in contact with heart, central circulatory system or CNS' : ''}`
      );
      break;
    }
    default:
      break;
  }

  const isActive =
    s.deviceKind === 'active' ||
    yes(s.activeTherapeutic) ||
    yes(s.activeDiagnostic) ||
    yes(s.administersOrRemovesMedicinalSubstances);
  if (isActive) {
    let ruled = false;
    if (yes(s.activeTherapeutic) && yes(s.administersOrExchangesEnergy)) {
      rule(
        9,
        yes(s.energyPotentiallyHazardous) ? 'IIb' : 'IIa',
        'active',
        'Active therapeutic device administering or exchanging energy'
      );
      ruled = true;
    }
    if (yes(s.activeDiagnostic)) {
      rule(
        10,
        yes(s.monitorsVitalPhysiologicalParameters) ? 'IIb' : 'IIa',
        'active',
        yes(s.monitorsVitalPhysiologicalParameters)
          ? 'Active device monitoring vital physiological parameters'
          : 'Active diagnostic device'
      );
      ruled = true;
    }
    if (yes(s.administersOrRemovesMedicinalSubstances)) {
      rule(
        12,
        yes(s.administrationPotentiallyHazardous) ? 'IIb' : 'IIa',
        'active',
        'Active device administering or removing medicinal substances'
      );
      ruled = true;
    }
    if (!ruled) rule(13, 'I', 'active', 'All other active devices');
  }
  if (yes(s.closedLoopTherapy))
    rule(
      22,
      'III',
      'active',
      'Active therapeutic device with integrated or incorporated diagnostic closed-loop function'
    );

  if (s.deviceKind === 'software' || hasSoftwarePurpose) {
    if (s.softwarePurpose === 'provides-information-for-decisions') {
      const h = s.softwareWorstCaseHarm;
      if (h === 'death-or-irreversible-deterioration')
        rule(
          11,
          'III',
          'software',
          'Software informing decisions where error may cause death or irreversible deterioration'
        );
      else if (h === 'serious-deterioration-or-surgical-intervention')
        rule(
          11,
          'IIb',
          'software',
          'Software informing decisions where error may cause serious deterioration or surgical intervention'
        );
      else if (h === 'other')
        rule(11, 'IIa', 'software', 'Software informing diagnostic or therapeutic decisions');
      else {
        rule(
          11,
          'IIb',
          'software',
          'Software informing decisions; worst-case harm not recorded, assumed serious'
        );
        flag(
          'F-SAMD-002',
          'software-as-medical-device',
          'medium',
          'Worst-case harm not recorded for decision-support software.',
          'Record the worst-case harm to confirm the class.'
        );
      }
    } else if (s.softwarePurpose === 'monitors-physiological-processes') {
      rule(
        11,
        yes(s.monitorsVitalPhysiologicalParameters) ? 'IIb' : 'IIa',
        'software',
        'Software monitoring physiological processes'
      );
    } else if (s.softwarePurpose === '') {
      rule(
        11,
        'IIa',
        'software',
        'Software device with no purpose recorded, assumed to inform decisions'
      );
      flag(
        'F-SAMD-003',
        'software-as-medical-device',
        'medium',
        'Software purpose not recorded; class assumed IIa.',
        'Record the software purpose to confirm the class.'
      );
    } else {
      rule(
        11,
        'I',
        'software',
        'Software without a diagnostic, therapeutic or monitoring purpose under Rule 11'
      );
    }
    flag(
      'F-SAMD-001',
      'software-as-medical-device',
      'medium',
      'Device includes software; IEC 62304 lifecycle applies.',
      'Confirm IEC 62304 software safety class and documentation.'
    );
  }

  if (yes(s.containsMedicinalSubstance)) {
    rule(
      14,
      'III',
      'special',
      'Incorporates a medicinal substance with action ancillary to the device'
    );
    flag(
      'F-MEDICINAL-001',
      'medicinal-substance-combination',
      'high',
      'Medicinal substance combination: medicines-agency consultation required.',
      'Plan consultation with a medicines authority.'
    );
  }
  if (yes(s.containsHumanOrAnimalTissue)) {
    rule(18, 'III', 'special', 'Manufactured utilizing human or animal tissues or cells');
    flag(
      'F-TISSUE-001',
      'tissue-origin',
      'high',
      'Tissue-derived device: sourcing and viral safety evidence required.',
      'Compile origin and viral inactivation evidence.'
    );
  }
  if (yes(s.containsNanomaterialWithHighExposurePotential)) {
    rule(
      19,
      'III',
      'special',
      'Incorporates nanomaterial with high or medium potential for internal exposure'
    );
    flag(
      'F-NANO-001',
      'nanomaterial',
      'high',
      'Nanomaterial with internal exposure potential.',
      'Include nanomaterial risk assessment.'
    );
  }
  if (yes(s.contraceptionOrStiPrevention)) {
    const implanted =
      s.deviceKind === 'implantable' || (s.deviceKind === 'surgically-invasive' && longTerm);
    rule(
      15,
      implanted ? 'III' : 'IIb',
      'special',
      'Contraception or prevention of sexually transmitted disease'
    );
  }
  if (yes(s.disinfectsOrCleansDevices))
    rule(16, 'IIa', 'special', 'Disinfecting, cleaning or sterilizing medical devices');
  if (yes(s.composedOfAbsorbedSubstances)) {
    const local = ['oral-nasal-ear', 'intact-skin', 'wounded-skin'].includes(s.bodySite);
    rule(
      21,
      local ? 'IIa' : s.bodySite === 'other-orifice' ? 'IIb' : 'III',
      'special',
      'Composed of substances absorbed by or dispersed in the body'
    );
  }

  if (firedRules.length === 0) rule(1, 'I', 'default', 'No rule raised the class');

  const computed = firedRules.reduce<FiredRule['deviceClass']>(
    (m, r) => (rank(r.deviceClass) > rank(m) ? r.deviceClass : m),
    'I'
  );
  const determining = firedRules.find((r) => r.deviceClass === computed);

  const final = (s.finalDeviceClass || computed) as DeviceClass;
  if (final !== computed) {
    flag(
      'F-OVERRIDE-001',
      'class-override',
      'high',
      `Assessor class ${final} differs from computed ${computed}.`,
      s.overrideReason.trim() === ''
        ? 'Record a reason for the override.'
        : 'Retain the override rationale in the technical file.'
    );
  }

  let classSuffix = '';
  if (final === 'I') {
    if (yes(s.suppliedSterile)) classSuffix += 's';
    if (yes(s.hasMeasuringFunction)) classSuffix += 'm';
    if (yes(s.reusableSurgicalInstrument)) classSuffix += 'r';
  }
  const conformityRoute: ConformityRoute =
    final === 'I'
      ? classSuffix
        ? 'notified-body-partial'
        : 'self-declaration'
      : 'notified-body-full';
  if (conformityRoute !== 'self-declaration') {
    flag(
      'F-NB-001',
      'notified-body-required',
      'medium',
      `Class ${final}${classSuffix} requires notified-body involvement.`,
      'Select and engage a notified body early.'
    );
  }

  const hasSoftwareOrActive =
    s.deviceKind === 'software' || s.deviceKind === 'active' || isActive || hasSoftwarePurpose;
  if (s.clinicalEvidenceStatus === 'none' || s.clinicalEvidenceStatus === '') {
    flag(
      'F-EVIDENCE-001',
      'clinical-evidence-gap',
      'high',
      'No clinical evaluation evidence recorded.',
      'Prepare a clinical evaluation report.'
    );
  } else if (s.clinicalEvidenceStatus === 'partial') {
    flag(
      'F-EVIDENCE-002',
      'clinical-evidence-gap',
      'medium',
      'Clinical evidence is partial.',
      'Close the clinical evidence gaps.'
    );
  }
  if (!yes(s.riskManagementFileIso14971))
    flag(
      'F-RISK-001',
      'risk-management-gap',
      'high',
      'No ISO 14971 risk management file.',
      'Establish the risk management file.'
    );
  if (!yes(s.qualityManagementSystemIso13485))
    flag(
      'F-QMS-001',
      'quality-system-gap',
      'high',
      'No ISO 13485 quality management system.',
      'Implement a QMS.'
    );
  if (hasSoftwareOrActive && !yes(s.cybersecurityAssessmentDone))
    flag(
      'F-CYBER-001',
      'cybersecurity-gap',
      'medium',
      'No cybersecurity assessment for a software or active device.',
      'Perform a cybersecurity risk assessment.'
    );
  if (!yes(s.postMarketSurveillancePlan))
    flag(
      'F-PMS-001',
      'post-market-surveillance-gap',
      'medium',
      'No post-market surveillance plan.',
      'Draft a PMS plan.'
    );
  if (!yes(s.uniqueDeviceIdentifierAssigned))
    flag(
      'F-UDI-001',
      'udi-gap',
      'low',
      'No unique device identifier assigned.',
      'Assign a UDI-DI.'
    );

  const regulatoryReadiness: Readiness = flags.some((f) =>
    [
      'clinical-evidence-gap',
      'risk-management-gap',
      'quality-system-gap',
      'cybersecurity-gap',
      'post-market-surveillance-gap',
      'udi-gap'
    ].includes(f.category)
  )
    ? 'gaps'
    : 'ready';

  return {
    computedDeviceClass: computed,
    finalDeviceClass: final,
    classSuffix,
    overrideReason: s.overrideReason,
    conformityRoute,
    determiningRule: determining!.ruleId,
    regulatoryReadiness,
    firedRules,
    additionalFlags: flags
  };
}
