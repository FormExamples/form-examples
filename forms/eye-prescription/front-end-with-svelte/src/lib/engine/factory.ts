import type {
  EyePrescription, EyeRefraction
} from './types.js';

export function createEmptyEye(): EyeRefraction {
  return {
    sphereDiopters: null,
    cylinderDiopters: null,
    axisDegrees: null,
    additionDiopters: null,
    intermediateAdditionDiopters: null,
    prismHorizontalDiopters: 0,
    baseHorizontal: '',
    prismVerticalDiopters: 0,
    baseVertical: '',
  };
}

export function createEmptyPrescription(): EyePrescription {
  return {
    prescriber: {
      name: '',
      gocRegistrationNumber: '',
      role: '',
      practiceName: '',
      practiceAddress: '',
      postcode: '',
      countryAsIso31661Alpha2: 'GB',
      email: '',
      phone: '',
    },
    patient: {
      name: '',
      birthDate: '',
      sex: '',
      email: '',
      phone: '',
      postalAddressAsFullText: '',
      countryAsIso31661Alpha2: 'GB',
      postcode: '',
      unitedKingdomNhsNumber: '',
    },
    examination: {
      examinationDate: '',
      examinationTime: '',
      issueDate: '',
      expiryDate: '',
      reasonForSightTest: '',
      priorPrescriptionDate: '',
      priorSphereRight: null,
      priorSphereLeft: null,
      notes: '',
    },
    visualAcuity: {
      distanceRightUnaided: '', distanceLeftUnaided: '', distanceBinocularUnaided: '',
      distanceRightCorrected: '', distanceLeftCorrected: '', distanceBinocularCorrected: '',
      nearRightUnaided: '', nearLeftUnaided: '', nearBinocularUnaided: '',
      nearRightCorrected: '', nearLeftCorrected: '', nearBinocularCorrected: '',
      pinholeRight: '', pinholeLeft: '',
      dominantEye: '',
    },
    rightEye: createEmptyEye(),
    leftEye: createEmptyEye(),
    pupillaryDistance: {
      distanceTotalMm: null, distanceRightMm: null, distanceLeftMm: null,
      nearTotalMm: null, nearRightMm: null, nearLeftMm: null,
      segmentHeightRightMm: null, segmentHeightLeftMm: null,
    },
    lensRecommendation: {
      lensType: '',
      material: '',
      refractiveIndex: null,
      aspheric: false,
      coatingAntiReflective: false,
      coatingScratchResistant: false,
      coatingHydrophobic: false,
      coatingBlueLight: false,
      coatingPhotochromic: false,
      coatingPolarised: false,
      coatingUv400: false,
      tintDescription: '',
      tintPercent: null,
      dispenserNotes: '',
    },
    ocularHealth: {
      slitLampRight: '', slitLampLeft: '',
      fundusRight: '', fundusLeft: '',
      intraocularPressureRightMmhg: null, intraocularPressureLeftMmhg: null,
      cupToDiscRatioRight: null, cupToDiscRatioLeft: null,
      octPerformed: false, octFindings: '',
      fieldsPerformed: false, fieldsFindings: '',
      pathologyFlag: false,
      referOphthalmology: false,
      referralReason: '',
    },
    grade: {
      overrideComplexity: '',
      overrideReason: '',
      followUpIntervalMonths: null,
      prescriberNotes: '',
      signedAt: false,
    },
  };
}
