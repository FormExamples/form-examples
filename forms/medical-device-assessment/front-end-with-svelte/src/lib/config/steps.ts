// Declarative definition of the nine wizard steps and their fields, ported
// from front-end-with-html/js/steps.js.
//
// Each field: { path, label, type, options?, hint?, show?(state, live) }.
// `path` is a dotted path into the state object (see engine/defaults.ts).
// `show` decides whether the question is relevant for the current answers;
// hidden questions keep their stored value so every engine field stays reachable.

import type { FieldOption, StepDef } from '#lib/engine/types.js';

export const YN: FieldOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const CLASSES: FieldOption[] = [
  { value: 'I', label: 'Class I' },
  { value: 'IIa', label: 'Class IIa' },
  { value: 'IIb', label: 'Class IIb' },
  { value: 'III', label: 'Class III' }
];

const INVASIVE_KINDS = ['invasive-body-orifice', 'surgically-invasive'];
const isYes = (v: string) => v === 'yes';

export const STEPS: StepDef[] = [
  {
    step: 1,
    short: 'Parties',
    title: 'Manufacturer and assessor',
    description: 'Who makes the device and who is carrying out this classification.',
    fields: [
      { path: 'manufacturer.name', label: 'Manufacturer name', type: 'text' },
      { path: 'manufacturer.email', label: 'Manufacturer email', type: 'email' },
      { path: 'manufacturer.phone', label: 'Manufacturer phone', type: 'tel' },
      {
        path: 'manufacturer.postalAddressAsFullText',
        label: 'Manufacturer postal address',
        type: 'textarea'
      },
      { path: 'manufacturer.postcode', label: 'Postcode', type: 'text' },
      {
        path: 'manufacturer.countryAsIso31661Alpha2',
        label: 'Country (ISO 3166-1 alpha-2)',
        type: 'text',
        hint: 'Two letters, e.g. GB, DE.'
      },
      {
        path: 'manufacturer.singleRegistrationNumber',
        label: 'Single registration number (SRN)',
        type: 'text'
      },
      {
        path: 'manufacturer.authorizedRepresentativeName',
        label: 'EU authorized representative',
        type: 'text'
      },
      {
        path: 'manufacturer.unitedKingdomResponsiblePersonName',
        label: 'UK responsible person',
        type: 'text'
      },
      { path: 'assessor.name', label: 'Assessor name', type: 'text' },
      { path: 'assessor.email', label: 'Assessor email', type: 'email' },
      { path: 'assessor.phone', label: 'Assessor phone', type: 'tel' },
      {
        path: 'assessor.role',
        label: 'Assessor role',
        type: 'select',
        options: [
          { value: 'regulatory-affairs', label: 'Regulatory affairs' },
          { value: 'clinical-engineer', label: 'Clinical engineer' },
          { value: 'quality-manager', label: 'Quality manager' },
          { value: 'clinical-safety-officer', label: 'Clinical safety officer' },
          { value: 'notified-body-reviewer', label: 'Notified body reviewer' },
          { value: 'other', label: 'Other' }
        ]
      },
      { path: 'assessor.organization', label: 'Assessor organization', type: 'text' }
    ]
  },
  {
    step: 2,
    short: 'Device',
    title: 'Device identification',
    description:
      'Name the device and state its intended purpose. Classification depends on the intended purpose.',
    fields: [
      { path: 'assessmentDate', label: 'Assessment date', type: 'date' },
      { path: 'deviceName', label: 'Device name', type: 'text' },
      { path: 'modelOrCatalogueNumber', label: 'Model or catalogue number', type: 'text' },
      { path: 'uniqueDeviceIdentifier', label: 'Unique device identifier (UDI-DI)', type: 'text' },
      {
        path: 'intendedPurpose',
        label: 'Intended purpose',
        type: 'textarea',
        hint: 'Required for classification.'
      },
      {
        path: 'intendedUser',
        label: 'Intended user',
        type: 'select',
        options: [
          { value: 'professional', label: 'Healthcare professional' },
          { value: 'lay-person', label: 'Lay person' },
          { value: 'both', label: 'Both' }
        ]
      },
      {
        path: 'targetJurisdiction',
        label: 'Target jurisdiction',
        type: 'select',
        options: [
          { value: 'eu-mdr', label: 'EU MDR 2017/745' },
          { value: 'uk-mdr', label: 'UK MDR 2002' },
          { value: 'both', label: 'Both' }
        ]
      },
      {
        path: 'isInVitroDiagnostic',
        label: 'Is this an in vitro diagnostic device?',
        type: 'yn',
        hint: 'IVDs are classified under IVDR 2017/746, not MDR Annex VIII; answering Yes blocks classification.'
      }
    ]
  },
  {
    step: 3,
    short: 'Contact',
    title: 'Device kind and contact',
    description: 'How the device interacts with the body (Annex VIII Rules 1 to 8).',
    fields: [
      {
        path: 'deviceKind',
        label: 'Device kind',
        type: 'select',
        options: [
          { value: 'non-invasive', label: 'Non-invasive' },
          { value: 'invasive-body-orifice', label: 'Invasive via a body orifice' },
          { value: 'surgically-invasive', label: 'Surgically invasive' },
          { value: 'implantable', label: 'Implantable' },
          { value: 'active', label: 'Active device' },
          { value: 'software', label: 'Software' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        path: 'contactDuration',
        label: 'Duration of continuous contact',
        type: 'select',
        hint: 'Transient: under 60 minutes. Short-term: up to 30 days. Long-term: over 30 days.',
        options: [
          { value: 'transient', label: 'Transient' },
          { value: 'short-term', label: 'Short-term' },
          { value: 'long-term', label: 'Long-term' }
        ],
        show: (s) => INVASIVE_KINDS.includes(s.deviceKind)
      },
      {
        path: 'bodySite',
        label: 'Body site of contact',
        type: 'select',
        options: [
          { value: 'intact-skin', label: 'Intact skin' },
          { value: 'wounded-skin', label: 'Wounded skin' },
          { value: 'oral-nasal-ear', label: 'Oral, nasal or ear cavity' },
          { value: 'other-orifice', label: 'Other body orifice' },
          { value: 'tissue', label: 'Tissue' },
          { value: 'central-circulatory-system', label: 'Central circulatory system' },
          { value: 'central-nervous-system', label: 'Central nervous system' },
          { value: 'heart', label: 'Heart' },
          { value: 'other', label: 'Other' }
        ],
        show: (s) => s.deviceKind !== ''
      },
      {
        path: 'channelsOrStoresBodySubstances',
        label: 'Does it channel or store blood, body liquids, cells or tissues?',
        type: 'yn',
        show: (s) => s.deviceKind === 'non-invasive'
      },
      {
        path: 'connectedToActiveDeviceClassIiaOrHigher',
        label: 'Is it connected to an active device of Class IIa or higher?',
        type: 'yn',
        show: (s) => s.deviceKind === 'non-invasive' && isYes(s.channelsOrStoresBodySubstances)
      }
    ]
  },
  {
    step: 4,
    short: 'Active',
    title: 'Active devices',
    description: 'Devices that depend on a source of energy (Rules 9, 10, 12, 13 and 22).',
    fields: [
      { path: 'activeTherapeutic', label: 'Active therapeutic device?', type: 'yn' },
      {
        path: 'administersOrExchangesEnergy',
        label: 'Administers or exchanges energy with the body?',
        type: 'yn',
        show: (s) => isYes(s.activeTherapeutic)
      },
      {
        path: 'energyPotentiallyHazardous',
        label: 'Is the energy exchange potentially hazardous?',
        type: 'yn',
        show: (s) => isYes(s.activeTherapeutic) && isYes(s.administersOrExchangesEnergy)
      },
      { path: 'activeDiagnostic', label: 'Active diagnostic or monitoring device?', type: 'yn' },
      {
        path: 'monitorsVitalPhysiologicalParameters',
        label:
          'Monitors vital physiological parameters where variations could be immediately dangerous?',
        type: 'yn',
        show: (s) =>
          isYes(s.activeDiagnostic) || s.softwarePurpose === 'monitors-physiological-processes'
      },
      {
        path: 'administersOrRemovesMedicinalSubstances',
        label: 'Administers or removes medicinal substances, body liquids or other substances?',
        type: 'yn'
      },
      {
        path: 'administrationPotentiallyHazardous',
        label: 'Is the administration or removal potentially hazardous?',
        type: 'yn',
        show: (s) => isYes(s.administersOrRemovesMedicinalSubstances)
      },
      {
        path: 'closedLoopTherapy',
        label: 'Active therapeutic device with an integrated diagnostic closed-loop function?',
        type: 'yn'
      }
    ]
  },
  {
    step: 5,
    short: 'Software',
    title: 'Software',
    description: 'Software that drives or influences a device, or is a device itself (Rule 11).',
    fields: [
      {
        path: 'softwarePurpose',
        label: 'Software purpose',
        type: 'select',
        hint: 'Leave unanswered if the device has no software. "None" does not apply Rule 11 unless the device kind is Software.',
        options: [
          {
            value: 'provides-information-for-decisions',
            label: 'Provides information for diagnostic or therapeutic decisions'
          },
          { value: 'monitors-physiological-processes', label: 'Monitors physiological processes' },
          {
            value: 'none',
            label: 'Software with no diagnostic, therapeutic or monitoring purpose'
          },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        path: 'softwareWorstCaseHarm',
        label: 'Worst-case harm if the software output is wrong',
        type: 'select',
        options: [
          {
            value: 'death-or-irreversible-deterioration',
            label: 'Death or irreversible deterioration of health'
          },
          {
            value: 'serious-deterioration-or-surgical-intervention',
            label: 'Serious deterioration of health or surgical intervention'
          },
          { value: 'other', label: 'Other' }
        ],
        show: (s) => s.softwarePurpose === 'provides-information-for-decisions'
      }
    ]
  },
  {
    step: 6,
    short: 'Special',
    title: 'Special characteristics',
    description: 'Special rules (14 to 21) that raise the class regardless of the device kind.',
    fields: [
      {
        path: 'containsMedicinalSubstance',
        label: 'Incorporates a medicinal substance with ancillary action?',
        type: 'yn'
      },
      {
        path: 'containsHumanOrAnimalTissue',
        label: 'Manufactured utilizing human or animal tissues or cells?',
        type: 'yn'
      },
      {
        path: 'containsNanomaterialWithHighExposurePotential',
        label: 'Incorporates nanomaterial with high or medium potential for internal exposure?',
        type: 'yn'
      },
      {
        path: 'composedOfAbsorbedSubstances',
        label: 'Composed of substances absorbed by or dispersed in the body?',
        type: 'yn'
      },
      {
        path: 'contraceptionOrStiPrevention',
        label: 'Used for contraception or prevention of sexually transmitted disease?',
        type: 'yn'
      },
      {
        path: 'disinfectsOrCleansDevices',
        label: 'Intended to disinfect, clean or sterilize medical devices?',
        type: 'yn'
      }
    ]
  },
  {
    step: 7,
    short: 'Suffix',
    title: 'Suffix modifiers',
    description:
      'Class I devices gain suffix s, m or r, which selects a partial notified-body route.',
    fields: [
      { path: 'suppliedSterile', label: 'Supplied sterile (suffix s)?', type: 'yn' },
      { path: 'hasMeasuringFunction', label: 'Has a measuring function (suffix m)?', type: 'yn' },
      {
        path: 'reusableSurgicalInstrument',
        label: 'Reusable surgical instrument (suffix r)?',
        type: 'yn'
      }
    ]
  },
  {
    step: 8,
    short: 'Readiness',
    title: 'Regulatory readiness',
    description: 'Evidence and systems the manufacturer must have in place.',
    fields: [
      {
        path: 'clinicalEvidenceStatus',
        label: 'Clinical evaluation evidence',
        type: 'select',
        options: [
          { value: 'complete', label: 'Complete' },
          { value: 'partial', label: 'Partial' },
          { value: 'none', label: 'None' }
        ]
      },
      {
        path: 'riskManagementFileIso14971',
        label: 'ISO 14971 risk management file in place?',
        type: 'yn'
      },
      {
        path: 'qualityManagementSystemIso13485',
        label: 'ISO 13485 quality management system in place?',
        type: 'yn'
      },
      { path: 'cybersecurityAssessmentDone', label: 'Cybersecurity assessment done?', type: 'yn' },
      {
        path: 'postMarketSurveillancePlan',
        label: 'Post-market surveillance plan in place?',
        type: 'yn'
      },
      {
        path: 'uniqueDeviceIdentifierAssigned',
        label: 'Unique device identifier assigned?',
        type: 'yn'
      }
    ]
  },
  {
    step: 9,
    short: 'Report',
    title: 'Report',
    description: 'Review the computed class, optionally override it with a reason, then submit.',
    fields: [
      {
        path: 'finalDeviceClass',
        label: 'Final device class',
        type: 'select',
        blankLabel: 'Use computed class',
        hint: 'Leave on "Use computed class" unless you are overriding the engine.',
        options: CLASSES
      },
      {
        path: 'overrideReason',
        label: 'Override reason',
        type: 'textarea',
        required: true,
        hint: 'Mandatory when the final class differs from the computed class.',
        show: (s, live) =>
          s.finalDeviceClass !== '' && s.finalDeviceClass !== live.computedDeviceClass
      },
      {
        path: 'status',
        label: 'Assessment status',
        type: 'select',
        blankLabel: null,
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'submitted', label: 'Submitted' },
          { value: 'reviewed', label: 'Reviewed' },
          { value: 'urgent', label: 'Urgent' }
        ]
      },
      { path: 'assessorNotes', label: 'Assessor notes', type: 'textarea' }
    ]
  }
];

export const TOTAL_STEPS = STEPS.length;
