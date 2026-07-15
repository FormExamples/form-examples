// Plain-JavaScript / JSDoc type definitions for the Medical Operation
// Note form. Mirrors the SvelteKit `src/lib/engine/types.ts` data model.
//
// Builds the canonical empty `OperationNote` shape so newly-added fields
// default correctly when older saved state is rehydrated from
// localStorage. Wrapped in an IIFE; published via
// `window.MedicalOperationNote`.

/**
 * Build a fresh, fully-blank operation note.
 * Strings default to ''; numeric, date, and time fields default to null;
 * lists default to [].
 */
function emptyOperationNote() {
  return {
    // 1. Operation identification
    operation: {
      hospital: '',
      theatreNumber: '',
      listType: '',
      caseStartTime: null,
      anaesthesiaStartTime: null,
      knifeToSkinTime: null,
      endOfSurgeryTime: null,
      caseEndTime: null,
      operationDate: null
    },
    // 2. Patient identification
    patient: {
      nhsNumber: '',
      mrn: '',
      firstName: '',
      lastName: '',
      dateOfBirth: null,
      sex: '',
      weightKg: null,
      heightCm: null,
      allergiesSummary: '',
      consentStatus: '',
      sideMarked: '',
      whoSignInCompleted: ''
    },
    // 3. Surgical team
    team: {
      leadSurgeonName: '',
      leadSurgeonGmc: '',
      firstAssistant: '',
      secondAssistant: '',
      anaesthetistName: '',
      anaesthetistGmc: '',
      odp: '',
      scrubNurse: '',
      circulatingNurse: '',
      studentsPresent: ''
    },
    // 4. Diagnoses & procedures
    diagnoses: {
      preOperativeDiagnosis: '',
      postOperativeDiagnosis: '',
      plannedProcedure: '',
      procedurePerformed: '',
      opcs4Codes: '',
      urgency: '',
      laterality: '',
      indication: ''
    },
    // 5. Anaesthesia
    anaesthesia: {
      type: '',
      airway: '',
      inductionAgent: '',
      maintenanceAgent: '',
      neuromuscularBlockade: '',
      regionalBlockDetails: '',
      linesAndMonitoring: '',
      crystalloidMl: null,
      colloidMl: null,
      bloodMl: null,
      anaestheticEvent: ''
    },
    // 6. Position, prep & approach
    approach: {
      patientPosition: '',
      pressureAreaProtection: '',
      prepSolution: '',
      drapes: '',
      surgicalApproach: '',
      incisionType: '',
      incisionLengthCm: null,
      tableTilt: '',
      tourniquetUsed: '',
      tourniquetSite: '',
      tourniquetPressureMmHg: null,
      tourniquetTimeOn: null,
      tourniquetTimeOff: null
    },
    // 7. Operative findings & technique
    findings: {
      techniqueSteps: '',
      pathologyFound: '',
      anatomicalAnomalies: '',
      photographsTaken: '',
      frozenSectionRequested: ''
    },
    // 8. Materials, implants & prostheses
    materials: {
      suturesUsed: '',
      staplesUsed: '',
      clipsUsed: '',
      meshUsed: '',
      screwsUsed: '',
      platesUsed: '',
      prostheticJoint: '',
      vascularGraft: '',
      implantLot: '',
      implantSerial: '',
      implantBatch: '',
      implantExpiry: null,
      manufacturer: '',
      registrySubmitted: ''
    },
    // 9. Drains, packs & specimens
    drains: {
      drainsPlaced: '',
      drainSite: '',
      drainOutputTargetMl: null,
      drainRemovalPlan: '',
      packsLeftInSitu: '',
      packCount: null,
      packRemovalByDate: null,
      urinaryCatheter: '',
      ngTube: '',
      specimensSent: '',
      specimenLabel: '',
      specimenContainer: '',
      specimenFixative: '',
      specimenDestination: '',
      specimenUrgency: ''
    },
    // 10. Safety, counts, EBL & complications
    safety: {
      swabCountFirst: null,
      swabCountFinal: null,
      swabCountAgreed: '',
      needleCountFirst: null,
      needleCountFinal: null,
      needleCountAgreed: '',
      instrumentCountFirst: null,
      instrumentCountFinal: null,
      instrumentCountAgreed: '',
      countDiscrepancyResolution: '',
      estimatedBloodLossMl: null,
      transfusionPrbcUnits: null,
      transfusionFfpUnits: null,
      transfusionPlateletsUnits: null,
      transfusionCryoUnits: null,
      massiveHaemorrhageProtocolActivated: '',
      intraOpComplication: '',
      complicationDescription: '',
      clavienDindoGrade: '',
      neverEventFlagged: '',
      neverEventType: '',
      retainedItemSuspected: '',
      conversionToOpen: '',
      intraOpArrest: '',
      equipmentProblem: '',
      sterilityBreach: ''
    },
    // 11. Post-operative plan
    postOp: {
      recoveryDestination: '',
      preOpPlannedDestination: '',
      monitoringFrequency: '',
      ivFluidsPlan: '',
      analgesiaPlan: '',
      antibioticsPlan: '',
      vteProphylaxisPlan: '',
      dietPlan: '',
      mobilisationPlan: '',
      woundCarePlan: '',
      drainRemovalPlan: '',
      followUpPlan: '',
      specialInstructions: '',
      whoSignOutCompleted: '',
      debriefCompleted: ''
    },
    // 12. Summary, grade & sign-off
    summary: {
      asaPhysicalStatus: null,
      surgeonOverrideGrade: '',
      surgeonOverrideReason: '',
      finalAttestation: '',
      electronicSignature: '',
      dictationTimestamp: null
    }
  };
}

// ---------------------------------------------------------------- //
// Ordered enums used by the grading engine
// ---------------------------------------------------------------- //

const COMPOSITE_RISK_ORDER = ['routine', 'complicated', 'high-risk', 'critical'];

const CLAVIEN_DINDO_ORDER = ['0', 'I', 'II', 'IIIa', 'IIIb', 'IVa', 'IVb', 'V'];

const EBL_BAND_ORDER = ['minimal', 'mild', 'moderate', 'severe', 'massive'];

const ASA_LABELS = {
  1: 'ASA I',
  2: 'ASA II',
  3: 'ASA III',
  4: 'ASA IV',
  5: 'ASA V',
  6: 'ASA VI'
};

/** Pretty label for a composite-risk band. */
function compositeRiskLabel(level) {
  switch (level) {
    case 'routine':     return 'Routine';
    case 'complicated': return 'Complicated';
    case 'high-risk':   return 'High-risk';
    case 'critical':    return 'Critical';
    default:            return '';
  }
}

/** Pretty label for a blood-loss band. */
function bloodLossBandLabel(band) {
  switch (band) {
    case 'minimal':  return 'Minimal (≤ 100 mL)';
    case 'mild':     return 'Mild (101-500 mL)';
    case 'moderate': return 'Moderate (501-1500 mL)';
    case 'severe':   return 'Severe (1501-3000 mL)';
    case 'massive':  return 'Massive (> 3000 mL)';
    default:         return '';
  }
}

export { emptyOperationNote, COMPOSITE_RISK_ORDER, CLAVIEN_DINDO_ORDER, EBL_BAND_ORDER, ASA_LABELS, compositeRiskLabel, bloodLossBandLabel };
