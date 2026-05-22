// Eye Prescription — data shape + empty-state helpers.
//
// Stores cylinder in MINUS-CYLINDER convention (≤ 0). Sphere may be
// negative (myopia) or positive (hyperopia). Addition is always positive.
// Empty string `''` for unanswered text/enum fields; null for unanswered
// numeric fields.

(function () {
  'use strict';
  const NS = (window.EyePrescription = window.EyePrescription || {});

  function emptyEye() {
    return {
      sphereDiopters: null,
      cylinderDiopters: null,
      axisDegrees: null,
      additionDiopters: null,
      intermediateAdditionDiopters: null,
      prismHorizontalDiopters: 0,
      baseHorizontal: '',
      prismVerticalDiopters: 0,
      baseVertical: ''
    };
  }

  function emptyPrescription() {
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
        phone: ''
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
        unitedKingdomNhsNumber: ''
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
        notes: ''
      },
      visualAcuity: {
        distanceRightUnaided: '',
        distanceLeftUnaided: '',
        distanceBinocularUnaided: '',
        distanceRightCorrected: '',
        distanceLeftCorrected: '',
        distanceBinocularCorrected: '',
        nearRightUnaided: '',
        nearLeftUnaided: '',
        nearBinocularUnaided: '',
        nearRightCorrected: '',
        nearLeftCorrected: '',
        nearBinocularCorrected: '',
        pinholeRight: '',
        pinholeLeft: '',
        dominantEye: ''
      },
      rightEye: emptyEye(),
      leftEye: emptyEye(),
      pupillaryDistance: {
        distanceTotalMm: null,
        distanceRightMm: null,
        distanceLeftMm: null,
        nearTotalMm: null,
        nearRightMm: null,
        nearLeftMm: null,
        segmentHeightRightMm: null,
        segmentHeightLeftMm: null
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
        dispenserNotes: ''
      },
      ocularHealth: {
        slitLampRight: '',
        slitLampLeft: '',
        fundusRight: '',
        fundusLeft: '',
        intraocularPressureRightMmhg: null,
        intraocularPressureLeftMmhg: null,
        cupToDiscRatioRight: null,
        cupToDiscRatioLeft: null,
        octPerformed: false,
        octFindings: '',
        fieldsPerformed: false,
        fieldsFindings: '',
        pathologyFlag: false,
        referOphthalmology: false,
        referralReason: ''
      },
      grade: {
        overrideComplexity: '',
        overrideReason: '',
        followUpIntervalMonths: null,
        prescriberNotes: '',
        signedAt: false
      }
    };
  }

  // Snap to 0.25 D step, return null if value is null/empty/NaN.
  function snapQuarter(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    return Math.round(n * 4) / 4;
  }

  // Age in whole years on a given reference date.
  function ageInYears(birthDate, referenceDate) {
    if (!birthDate || !referenceDate) return null;
    const b = new Date(birthDate);
    const r = new Date(referenceDate);
    if (Number.isNaN(b.getTime()) || Number.isNaN(r.getTime())) return null;
    let age = r.getFullYear() - b.getFullYear();
    const m = r.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && r.getDate() < b.getDate())) age -= 1;
    return age;
  }

  NS.emptyPrescription = emptyPrescription;
  NS.emptyEye = emptyEye;
  NS.snapQuarter = snapQuarter;
  NS.ageInYears = ageInYears;
}());
