// Framingham Risk Score for Hard CHD — data model and labels.
//
// Wrapped in an IIFE so private symbols never leak. Public exports attach
// to `window.FraminghamRiskScore`. Mirrors the SvelteKit
// `src/lib/engine/types.ts` and `src/lib/stores/assessment.svelte.ts`.

  /** A pristine assessment with every field at its empty default. */
  function emptyAssessment() {
    return {
      patientInformation: {
        fullName: '',
        dateOfBirth: '',
        nhsNumber: '',
        address: '',
        telephone: '',
        email: '',
        gpName: '',
        gpPractice: ''
      },
      demographics: {
        age: null,
        sex: '',
        ethnicity: '',
        heightCm: null,
        weightKg: null
      },
      smokingHistory: {
        smokingStatus: '',
        cigarettesPerDay: null,
        yearsSmoked: null,
        yearsSinceQuit: null
      },
      bloodPressure: {
        systolicBp: null,
        diastolicBp: null,
        onBpTreatment: '',
        bpMedicationName: '',
        bpMeasurementMethod: ''
      },
      cholesterol: {
        totalCholesterol: null,
        hdlCholesterol: null,
        ldlCholesterol: null,
        triglycerides: null,
        cholesterolUnit: 'mgDl',
        fastingSample: ''
      },
      medicalHistory: {
        hasDiabetes: '',
        hasPriorChd: '',
        hasPeripheralVascularDisease: '',
        hasCerebrovascularDisease: '',
        hasHeartFailure: '',
        hasAtrialFibrillation: '',
        otherConditions: ''
      },
      familyHistory: {
        familyChdHistory: '',
        familyChdAgeOnset: '',
        familyChdRelationship: '',
        familyStrokeHistory: '',
        familyDiabetesHistory: ''
      },
      lifestyleFactors: {
        physicalActivity: '',
        alcoholConsumption: '',
        dietQuality: '',
        bmi: null,
        waistCircumferenceCm: null,
        stressLevel: ''
      },
      currentMedications: {
        onStatin: '',
        statinName: '',
        onAspirin: '',
        onAntihypertensive: '',
        antihypertensiveName: '',
        otherMedications: ''
      },
      reviewCalculate: {
        clinicianName: '',
        reviewDate: '',
        clinicalNotes: '',
        patientConsent: ''
      }
    };
  }

  /** Human-readable label for a risk level. */
  function riskLevelLabel(level) {
    switch (level) {
      case 'low': return 'Low Risk';
      case 'intermediate': return 'Intermediate Risk';
      case 'high': return 'High Risk';
      case 'draft': return 'Draft (incomplete)';
      default: return 'Unknown';
    }
  }

  /** CSS modifier class for the risk badge. */
  function riskLevelClass(level) {
    switch (level) {
      case 'low': return 'risk-low';
      case 'intermediate': return 'risk-intermediate';
      case 'high': return 'risk-high';
      case 'draft': return 'risk-draft';
      default: return 'risk-draft';
    }
  }

  /** Convert mmol/L to mg/dL (multiply by 38.67). */
  function convertMmolToMg(mmol) {
    return mmol * 38.67;
  }

  /** Calculate BMI from height (cm) and weight (kg). */
  function calculateBmi(heightCm, weightKg) {
    if (heightCm == null || weightKg == null || heightCm <= 0) return null;
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }

  /** Returns true if smokingStatus indicates current smoker. */
  function isSmoker(status) {
    return status === 'current';
  }

  /** Treat data as draft if age and sex are both missing. */
  function isLikelyDraft(data) {
    return data.demographics.age === null && data.demographics.sex === '';
  }

  // Attach to namespace
  
  

export { emptyAssessment, riskLevelLabel, riskLevelClass, convertMmolToMg, calculateBmi, isSmoker, isLikelyDraft };
