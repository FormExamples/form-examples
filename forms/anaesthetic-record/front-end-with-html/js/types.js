// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Anaesthetic Record form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_anaesthetic_record.sql` (parent record) and the three
// one-to-many child tables:
//   `sql/05_create_table_anaesthetic_record_drug_administration.sql`
//   `sql/06_create_table_anaesthetic_record_timed_observation.sql`
//   `sql/07_create_table_anaesthetic_record_intra_operative_event.sql`
//
// This file builds and exports the canonical empty RecordData shape used by the
// wizard, so newly-added fields default correctly when older saved state is
// rehydrated from localStorage. It also exports the empty-child-row factories
// and the display-label helpers.
//
// Unlike a numeric-score form, the engine here grades COMPLETENESS and VALIDITY:
// it classifies each record as Complete / Partial / Incomplete against a fixed
// set of mandatory-item rules (split critical / non-critical), reports a
// `completenessPercent`, and — independently — raises safety flags.

/**
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'elective' | 'urgent' | 'emergency' | 'immediate' | ''} Urgency
 * @typedef {'general' | 'regional' | 'sedation' | 'mac' | 'combined' | ''} AnaestheticTechnique
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | ''} AsaStatus
 * @typedef {'facemask' | 'supraglottic' | 'tracheal-tube' | 'tracheostomy' | 'awake-foi' | ''} AirwayTechnique
 * @typedef {'none' | 'spinal' | 'epidural' | 'cse' | 'peripheral-block' | ''} RegionalTechnique
 * @typedef {'recovery' | 'hdu' | 'icu' | 'ward' | ''} RecoveryDestination
 * @typedef {'mg' | 'mcg' | 'g' | 'ml' | 'units' | 'mmol' | 'puff' | 'other' | ''} DoseUnit
 * @typedef {'iv' | 'im' | 'subcutaneous' | 'inhalational' | 'oral' | 'topical' | 'neuraxial' | 'infusion' | 'other' | ''} Route
 * @typedef {'induction' | 'neuromuscular-blocker' | 'maintenance' | 'reversal' | 'analgesia' | 'antiemetic' | 'antibiotic' | 'vasoactive' | 'local-anaesthetic' | 'other' | ''} DrugCategory
 * @typedef {'desaturation' | 'hypotension' | 'arrhythmia' | 'laryngospasm' | 'bronchospasm' | 'anaphylaxis' | 'difficult-airway' | 'awareness' | 'other' | ''} EventType
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * One administered drug — mirrors the child table
 * `anaesthetic_record_drug_administration`.
 *
 * @typedef {Object} DrugAdministration
 * @property {string} drugName
 * @property {number | null} dose
 * @property {DoseUnit} doseUnit
 * @property {Route} route
 * @property {DrugCategory} category
 * @property {string} administeredAt        - ISO-ish datetime-local string; '' when unset
 */

/**
 * One timed physiological observation — mirrors the child table
 * `anaesthetic_record_timed_observation`.
 *
 * @typedef {Object} TimedObservation
 * @property {string} observedAt            - ISO-ish datetime-local string; '' when unset
 * @property {number | null} systolicBloodPressure
 * @property {number | null} diastolicBloodPressure
 * @property {number | null} heartRate
 * @property {number | null} spo2
 * @property {number | null} endTidalCo2
 * @property {number | null} temperature
 * @property {number | null} agentPercent
 * @property {number | null} freshGasFlowL
 */

/**
 * One intra-operative event — mirrors the child table
 * `anaesthetic_record_intra_operative_event`.
 *
 * @typedef {Object} IntraOperativeEvent
 * @property {EventType} eventType
 * @property {string} occurredAt            - ISO-ish datetime-local string; '' when unset
 * @property {string} management
 */

/**
 * Step 1 — case identification (also carries the overall anaesthetic technique).
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {string} patientName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} weightKg
 * @property {number | null} heightCm
 * @property {string} theatre
 * @property {string} operationDate
 * @property {string} anaesthetistName
 * @property {string} assistantName
 * @property {string} surgeonName
 * @property {string} plannedProcedure
 * @property {Urgency} urgency
 * @property {AnaestheticTechnique} anaestheticTechnique
 */

/**
 * Step 2 — pre-induction checks.
 * @typedef {Object} PreInduction
 * @property {YesNo} machineChecked
 * @property {YesNo} whoSignIn
 * @property {YesNo} whoTimeOut
 * @property {YesNo} consentConfirmed
 * @property {YesNo} fastingConfirmed
 * @property {string} ivAccess
 * @property {YesNo} allergyBandChecked
 * @property {string} documentedAllergies
 */

/**
 * Step 3 — ASA & airway assessment.
 * @typedef {Object} AsaAirway
 * @property {AsaStatus} asaStatus
 * @property {YesNo} asaEmergencyModifier
 * @property {number | null} mallampatiClass
 * @property {number | null} mouthOpeningCm
 * @property {number | null} thyromentalDistanceCm
 * @property {string} dentition
 * @property {YesNo} anticipatedDifficultAirway
 * @property {YesNo} priorDifficultIntubation
 */

/**
 * Step 5 — airway management.
 * @typedef {Object} Airway
 * @property {AirwayTechnique} airwayTechnique
 * @property {string} deviceSize
 * @property {number | null} tubeDepthCm
 * @property {YesNo} cuffed
 * @property {number | null} cormackLehaneGrade
 * @property {number | null} intubationAttempts
 * @property {YesNo} capnographyConfirmed
 */

/**
 * Step 6 — monitoring modalities in use.
 * @typedef {Object} Monitoring
 * @property {string[]} monitoringModalities
 */

/**
 * Step 8 — fluids & blood loss.
 * @typedef {Object} Fluids
 * @property {number | null} crystalloidMl
 * @property {number | null} colloidMl
 * @property {number | null} bloodProductsMl
 * @property {number | null} estimatedBloodLossMl
 * @property {number | null} urineOutputMl
 * @property {number | null} cellSalvageMl
 */

/**
 * Step 9 — regional / neuraxial technique.
 * @typedef {Object} Regional
 * @property {RegionalTechnique} regionalTechnique
 * @property {string} regionalLevel
 * @property {string} regionalDrug
 * @property {number | null} regionalDoseMg
 * @property {string} blockHeight
 * @property {string} regionalComplications
 */

/**
 * Step 11 — recovery handover.
 * @typedef {Object} Handover
 * @property {RecoveryDestination} recoveryDestination
 * @property {string} handoverAirwayStatus
 * @property {string} analgesiaPlan
 * @property {string} antiemeticPlan
 * @property {string} oxygenPlan
 * @property {string} outstandingTasks
 * @property {string} handoverAt
 * @property {string} receivingPractitioner
 */

/**
 * Step 12 — sign-off.
 * @typedef {Object} SignOff
 * @property {string} anaesthetistSignature
 * @property {string} signedAt
 */

/**
 * @typedef {Object} RecordData
 * @property {Identification} identification
 * @property {PreInduction} preInduction
 * @property {AsaAirway} asaAirway
 * @property {DrugAdministration[]} drugs
 * @property {Airway} airway
 * @property {Monitoring} monitoring
 * @property {TimedObservation[]} observations
 * @property {Fluids} fluids
 * @property {Regional} regional
 * @property {IntraOperativeEvent[]} events
 * @property {Handover} handover
 * @property {SignOff} signoff
 */

/**
 * One mandatory-item rule result in the completeness audit trail. Mirrors the
 * `anaesthetic_record_grade_rule` SQL table.
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category           - 'critical' | 'noncritical'
 * @property {string} label
 * @property {boolean} satisfied
 */

/**
 * One safety flag. Mirrors the `anaesthetic_record_grade_flag` SQL table.
 * @typedef {Object} Flag
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {CompletenessStatus} status
 * @property {number} completenessPercent   - 0..100
 * @property {FiredRule[]} firedRules
 * @property {number} criticalMissing
 * @property {number} noncriticalMissing
 * @property {Flag[]} flags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.AnaestheticRecord`.
(function () {
'use strict';
window.AnaestheticRecord = window.AnaestheticRecord || {};

/**
 * Build a fresh, fully-blank drug-administration row.
 * @returns {DrugAdministration}
 */
function emptyDrug() {
  return {
    drugName: '',
    dose: null,
    doseUnit: '',
    route: '',
    category: '',
    administeredAt: ''
  };
}

/**
 * Build a fresh, fully-blank timed-observation row.
 * @returns {TimedObservation}
 */
function emptyObservation() {
  return {
    observedAt: '',
    systolicBloodPressure: null,
    diastolicBloodPressure: null,
    heartRate: null,
    spo2: null,
    endTidalCo2: null,
    temperature: null,
    agentPercent: null,
    freshGasFlowL: null
  };
}

/**
 * Build a fresh, fully-blank intra-operative-event row.
 * @returns {IntraOperativeEvent}
 */
function emptyEvent() {
  return {
    eventType: '',
    occurredAt: '',
    management: ''
  };
}

/**
 * Build a fresh, fully-blank anaesthetic record.
 * Strings / enums default to `''`; numeric, date, and time fields default to
 * `null` or `''`; the three child lists default to `[]`.
 * @returns {RecordData}
 */
function emptyRecord() {
  return {
    identification: {
      patientIdentifier: '',
      patientName: '',
      dateOfBirth: '',
      sex: '',
      weightKg: null,
      heightCm: null,
      theatre: '',
      operationDate: '',
      anaesthetistName: '',
      assistantName: '',
      surgeonName: '',
      plannedProcedure: '',
      urgency: '',
      anaestheticTechnique: ''
    },
    preInduction: {
      machineChecked: '',
      whoSignIn: '',
      whoTimeOut: '',
      consentConfirmed: '',
      fastingConfirmed: '',
      ivAccess: '',
      allergyBandChecked: '',
      documentedAllergies: ''
    },
    asaAirway: {
      asaStatus: '',
      asaEmergencyModifier: '',
      mallampatiClass: null,
      mouthOpeningCm: null,
      thyromentalDistanceCm: null,
      dentition: '',
      anticipatedDifficultAirway: '',
      priorDifficultIntubation: ''
    },
    drugs: [],
    airway: {
      airwayTechnique: '',
      deviceSize: '',
      tubeDepthCm: null,
      cuffed: '',
      cormackLehaneGrade: null,
      intubationAttempts: null,
      capnographyConfirmed: ''
    },
    monitoring: {
      monitoringModalities: []
    },
    observations: [],
    fluids: {
      crystalloidMl: null,
      colloidMl: null,
      bloodProductsMl: null,
      estimatedBloodLossMl: null,
      urineOutputMl: null,
      cellSalvageMl: null
    },
    regional: {
      regionalTechnique: '',
      regionalLevel: '',
      regionalDrug: '',
      regionalDoseMg: null,
      blockHeight: '',
      regionalComplications: ''
    },
    events: [],
    handover: {
      recoveryDestination: '',
      handoverAirwayStatus: '',
      analgesiaPlan: '',
      antiemeticPlan: '',
      oxygenPlan: '',
      outstandingTasks: '',
      handoverAt: '',
      receivingPractitioner: ''
    },
    signoff: {
      anaesthetistSignature: '',
      signedAt: ''
    }
  };
}

// ---------------------------------------------------------------------------
// Display-label helpers
// ---------------------------------------------------------------------------

/** Completeness-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the completeness-status badge (shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

/** Urgency label. */
function urgencyLabel(u) {
  switch (u) {
    case 'elective': return 'Elective';
    case 'urgent': return 'Urgent';
    case 'emergency': return 'Emergency';
    case 'immediate': return 'Immediate';
    default: return '';
  }
}

/** Patient-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** ASA physical-status label. */
function asaLabel(asa) {
  return asa ? `ASA ${asa}` : '';
}

/** Anaesthetic-technique label. */
function anaestheticTechniqueLabel(t) {
  switch (t) {
    case 'general': return 'General';
    case 'regional': return 'Regional';
    case 'sedation': return 'Sedation';
    case 'mac': return 'Monitored anaesthesia care';
    case 'combined': return 'Combined';
    default: return '';
  }
}

/** Airway-technique label. */
function airwayTechniqueLabel(t) {
  switch (t) {
    case 'facemask': return 'Facemask';
    case 'supraglottic': return 'Supraglottic airway';
    case 'tracheal-tube': return 'Tracheal tube';
    case 'tracheostomy': return 'Tracheostomy';
    case 'awake-foi': return 'Awake fibreoptic intubation';
    default: return '';
  }
}

/** Regional-technique label. */
function regionalTechniqueLabel(t) {
  switch (t) {
    case 'none': return 'None';
    case 'spinal': return 'Spinal';
    case 'epidural': return 'Epidural';
    case 'cse': return 'Combined spinal-epidural';
    case 'peripheral-block': return 'Peripheral nerve block';
    default: return '';
  }
}

/** Recovery-destination label. */
function recoveryDestinationLabel(d) {
  switch (d) {
    case 'recovery': return 'Recovery / PACU';
    case 'hdu': return 'HDU';
    case 'icu': return 'ICU';
    case 'ward': return 'Ward';
    default: return '';
  }
}

/** Dose-unit label. */
function doseUnitLabel(u) {
  switch (u) {
    case 'mg': return 'mg';
    case 'mcg': return 'mcg';
    case 'g': return 'g';
    case 'ml': return 'mL';
    case 'units': return 'units';
    case 'mmol': return 'mmol';
    case 'puff': return 'puff';
    case 'other': return 'other';
    default: return '';
  }
}

/** Route-of-administration label. */
function routeLabel(r) {
  switch (r) {
    case 'iv': return 'IV';
    case 'im': return 'IM';
    case 'subcutaneous': return 'Subcutaneous';
    case 'inhalational': return 'Inhalational';
    case 'oral': return 'Oral';
    case 'topical': return 'Topical';
    case 'neuraxial': return 'Neuraxial';
    case 'infusion': return 'Infusion';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Drug-category label. */
function drugCategoryLabel(c) {
  switch (c) {
    case 'induction': return 'Induction';
    case 'neuromuscular-blocker': return 'Neuromuscular blocker';
    case 'maintenance': return 'Maintenance';
    case 'reversal': return 'Reversal';
    case 'analgesia': return 'Analgesia';
    case 'antiemetic': return 'Antiemetic';
    case 'antibiotic': return 'Antibiotic';
    case 'vasoactive': return 'Vasoactive';
    case 'local-anaesthetic': return 'Local anaesthetic';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Intra-operative event-type label. */
function eventTypeLabel(e) {
  switch (e) {
    case 'desaturation': return 'Desaturation';
    case 'hypotension': return 'Hypotension';
    case 'arrhythmia': return 'Arrhythmia';
    case 'laryngospasm': return 'Laryngospasm';
    case 'bronchospasm': return 'Bronchospasm';
    case 'anaphylaxis': return 'Anaphylaxis';
    case 'difficult-airway': return 'Difficult airway';
    case 'awareness': return 'Awareness';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Monitoring-modality label. */
function monitoringModalityLabel(m) {
  switch (m) {
    case 'ecg': return 'ECG';
    case 'nibp': return 'NIBP';
    case 'arterial-line': return 'Arterial line';
    case 'spo2': return 'SpO₂';
    case 'capnography': return 'Capnography';
    case 'temperature': return 'Temperature';
    case 'neuromuscular': return 'Neuromuscular';
    case 'depth-of-anaesthesia': return 'Depth of anaesthesia';
    case 'cvp': return 'CVP';
    case 'urine-output': return 'Urine output';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

Object.assign(window.AnaestheticRecord, {
  emptyDrug,
  emptyObservation,
  emptyEvent,
  emptyRecord,
  statusLabel,
  statusClass,
  urgencyLabel,
  sexLabel,
  asaLabel,
  anaestheticTechniqueLabel,
  airwayTechniqueLabel,
  regionalTechniqueLabel,
  recoveryDestinationLabel,
  doseUnitLabel,
  routeLabel,
  drugCategoryLabel,
  eventTypeLabel,
  monitoringModalityLabel,
  priorityLabel
});
})();
