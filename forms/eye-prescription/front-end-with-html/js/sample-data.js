// Sample prescription data for the dashboard. Each record matches the
// shape produced by the data-entry form (front-end-form-with-html). The
// `classification` field is computed and stored alongside the
// prescription so the dashboard can sort and filter without re-running
// the engine.
//
// Records span simple / moderate / complex complexity, every flag
// category, several lens types, and a mix of expired vs. active.

(function () {
  'use strict';
  const NS = (window.EyePrescriptionDashboard = window.EyePrescriptionDashboard || {});

  function eye(sph, cyl, axis, add, prismH, baseH, prismV, baseV) {
    return {
      sphereDiopters: sph,
      cylinderDiopters: cyl,
      axisDegrees: axis,
      additionDiopters: add ?? null,
      intermediateAdditionDiopters: null,
      prismHorizontalDiopters: prismH || 0,
      baseHorizontal: baseH || '',
      prismVerticalDiopters: prismV || 0,
      baseVertical: baseV || ''
    };
  }

  function rx({
    id, patient, prescriber, examinationDate, issueDate, expiryDate,
    status, rightEye, leftEye, lensType, material,
    complexity, flags = [], birthDate, gocNumber, practiceName,
    reasonForSightTest = 'routine'
  }) {
    return {
      id,
      patient: {
        name: patient,
        birthDate,
        sex: '',
        unitedKingdomNhsNumber: ''
      },
      prescriber: {
        name: prescriber,
        gocRegistrationNumber: gocNumber,
        practiceName,
        role: 'optometrist'
      },
      examination: {
        examinationDate,
        issueDate,
        expiryDate,
        reasonForSightTest
      },
      rightEye,
      leftEye,
      lensRecommendation: {
        lensType,
        material,
        aspheric: false,
        coatingAntiReflective: true,
        coatingScratchResistant: true,
        coatingUv400: true,
        coatingHydrophobic: false,
        coatingBlueLight: false,
        coatingPhotochromic: false,
        coatingPolarised: false,
        tintDescription: '',
        tintPercent: null
      },
      classification: { complexity, flags }
    };
  }

  const todayIso = new Date().toISOString().slice(0, 10);

  function flag(category, eye, priority, description, action) {
    return { category, eye, priority, description, suggestedAction: action };
  }

  const data = [
    rx({
      id: 'rx-001', patient: 'Alice Bennett', prescriber: 'Jane Smith',
      gocNumber: '01-12345', practiceName: 'High Street Opticians',
      birthDate: '1985-04-12',
      examinationDate: '2025-09-14', issueDate: '2025-09-14', expiryDate: '2027-09-14',
      status: 'active',
      rightEye: eye(-1.50, -0.25, 175),
      leftEye: eye(-1.25, 0, null),
      lensType: 'single-vision-distance', material: 'cr-39',
      complexity: 'simple', flags: []
    }),
    rx({
      id: 'rx-002', patient: 'Brian Carter', prescriber: 'Mark Patel',
      gocNumber: '01-22246', practiceName: 'Bridge Vision Centre',
      birthDate: '1962-11-03',
      examinationDate: '2026-01-20', issueDate: '2026-01-20', expiryDate: '2028-01-20',
      status: 'active',
      rightEye: eye(2.25, -0.75, 90, 2.00),
      leftEye: eye(2.50, -0.50, 95, 2.00),
      lensType: 'varifocal', material: 'high-index-1.67',
      complexity: 'moderate',
      flags: [flag('presbyopia', 'both', 'low', 'Addition prescribed (established-presbyopia)', 'Counsel patient on accommodation expectations')]
    }),
    rx({
      id: 'rx-003', patient: 'Catherine Du', prescriber: 'Jane Smith',
      gocNumber: '01-12345', practiceName: 'High Street Opticians',
      birthDate: '1978-02-28',
      examinationDate: '2025-11-04', issueDate: '2025-11-04', expiryDate: '2027-11-04',
      status: 'active',
      rightEye: eye(-7.50, -2.75, 90, 2.00, 1.00, 'in'),
      leftEye: eye(-2.00, -0.50, 180, 2.00),
      lensType: 'varifocal', material: 'high-index-1.74',
      complexity: 'complex',
      flags: [
        flag('high-myopia', 'right', 'medium', 'Right sphere -7.50 D below -6.00 D', 'Consider retinal screening every 12 months'),
        flag('high-astigmatism', 'right', 'medium', 'Right cylinder -2.75 D magnitude > 2.50 D', 'Consider corneal topography; rule out keratoconus'),
        flag('anisometropia', 'both', 'medium', 'Anisometropia 5.50 D > 2.00 D', 'Adaptation period expected; consider contact-lens correction'),
        flag('prism-present', 'both', 'medium', 'Prism prescribed in one or both eyes', 'Document indication; review binocular vision'),
        flag('presbyopia', 'both', 'low', 'Addition prescribed (established-presbyopia)', 'Counsel patient on accommodation expectations')
      ]
    }),
    rx({
      id: 'rx-004', patient: 'Daniel Evans', prescriber: 'Mark Patel',
      gocNumber: '01-22246', practiceName: 'Bridge Vision Centre',
      birthDate: '2015-07-10',
      examinationDate: '2026-03-02', issueDate: '2026-03-02', expiryDate: '2027-03-02',
      status: 'active',
      rightEye: eye(-3.50, -1.00, 10),
      leftEye: eye(-3.75, -0.75, 170),
      lensType: 'single-vision-distance', material: 'polycarbonate',
      complexity: 'moderate',
      flags: [flag('paediatric', 'both', 'medium', 'Patient age 10 years < 16', 'Use polycarbonate or Trivex; expiry default 1 year')]
    }),
    rx({
      id: 'rx-005', patient: 'Evelyn Foster', prescriber: 'Sarah Lin',
      gocNumber: '01-33445', practiceName: 'Park Lane Optometry',
      birthDate: '1951-09-22',
      examinationDate: '2023-04-15', issueDate: '2023-04-15', expiryDate: '2024-04-15',
      status: 'active',
      rightEye: eye(1.25, -0.50, 90, 2.50),
      leftEye: eye(1.50, -0.25, 85, 2.50),
      lensType: 'bifocal', material: 'cr-39',
      complexity: 'moderate',
      flags: [
        flag('presbyopia', 'both', 'low', 'Addition prescribed (established-presbyopia)', 'Counsel patient on accommodation expectations'),
        flag('prescription-expired', 'both', 'high', `Expiry date 2024-04-15 is in the past`, 'Schedule a new sight test before dispensing')
      ]
    }),
    rx({
      id: 'rx-006', patient: 'Farah Ghani', prescriber: 'Jane Smith',
      gocNumber: '01-12345', practiceName: 'High Street Opticians',
      birthDate: '1995-12-01',
      examinationDate: '2026-02-10', issueDate: '2026-02-10', expiryDate: '2028-02-10',
      status: 'active',
      rightEye: eye(0, 0, null),
      leftEye: eye(-0.25, 0, null),
      lensType: 'single-vision-distance', material: 'cr-39',
      complexity: 'simple', flags: []
    }),
    rx({
      id: 'rx-007', patient: 'George Holt', prescriber: 'Mark Patel',
      gocNumber: '01-22246', practiceName: 'Bridge Vision Centre',
      birthDate: '1969-06-18',
      examinationDate: '2026-04-22', issueDate: '2026-04-22', expiryDate: '2028-04-22',
      status: 'active',
      rightEye: eye(-2.00, -1.50, 175, 1.50),
      leftEye: eye(-2.25, -1.25, 5, 1.50),
      lensType: 'occupational-varifocal', material: 'high-index-1.67',
      complexity: 'moderate',
      flags: [flag('presbyopia', 'both', 'low', 'Addition prescribed (early-presbyopia)', 'Counsel patient on accommodation expectations')]
    }),
    rx({
      id: 'rx-008', patient: 'Hannah Iqbal', prescriber: 'Sarah Lin',
      gocNumber: '01-33445', practiceName: 'Park Lane Optometry',
      birthDate: '1940-03-30',
      examinationDate: '2026-05-01', issueDate: '2026-05-01', expiryDate: '2027-05-01',
      status: 'active',
      rightEye: eye(5.50, -0.75, 95, 2.75),
      leftEye: eye(5.25, -0.50, 100, 2.75),
      lensType: 'varifocal', material: 'high-index-1.67',
      complexity: 'complex',
      flags: [
        flag('high-hyperopia', 'right', 'medium', 'Right sphere +5.50 D above +5.00 D', 'Assess angle-closure risk; gonioscopy if indicated'),
        flag('high-hyperopia', 'left', 'medium', 'Left sphere +5.25 D above +5.00 D', 'Assess angle-closure risk; gonioscopy if indicated'),
        flag('presbyopia', 'both', 'low', 'Addition prescribed (advanced-presbyopia)', 'Counsel patient on accommodation expectations')
      ]
    }),
    rx({
      id: 'rx-009', patient: 'Imran Joshi', prescriber: 'Jane Smith',
      gocNumber: '01-12345', practiceName: 'High Street Opticians',
      birthDate: '1989-08-14',
      examinationDate: '2026-03-30', issueDate: '2026-03-30', expiryDate: '2028-03-30',
      status: 'active',
      rightEye: eye(-4.25, -3.50, 170),
      leftEye: eye(-4.00, -3.25, 12),
      lensType: 'single-vision-distance', material: 'high-index-1.67',
      complexity: 'complex',
      flags: [
        flag('high-astigmatism', 'right', 'medium', 'Right cylinder -3.50 D magnitude > 2.50 D', 'Consider corneal topography; rule out keratoconus'),
        flag('high-astigmatism', 'left', 'medium', 'Left cylinder -3.25 D magnitude > 2.50 D', 'Consider corneal topography; rule out keratoconus')
      ]
    }),
    rx({
      id: 'rx-010', patient: 'Jessica Khan', prescriber: 'Sarah Lin',
      gocNumber: '01-33445', practiceName: 'Park Lane Optometry',
      birthDate: '1972-05-25',
      examinationDate: '2025-12-08', issueDate: '2025-12-08', expiryDate: '2027-12-08',
      status: 'superseded',
      rightEye: eye(-3.00, -0.50, 90, 1.25),
      leftEye: eye(-3.25, -0.50, 85, 1.25),
      lensType: 'bifocal', material: 'cr-39',
      complexity: 'moderate',
      flags: [flag('presbyopia', 'both', 'low', 'Addition prescribed (early-presbyopia)', 'Counsel patient on accommodation expectations')]
    }),
    rx({
      id: 'rx-011', patient: 'Karl Liu', prescriber: 'Mark Patel',
      gocNumber: '01-22246', practiceName: 'Bridge Vision Centre',
      birthDate: '2008-01-15',
      examinationDate: '2026-04-05', issueDate: '2026-04-05', expiryDate: '2027-04-05',
      status: 'active',
      rightEye: eye(-1.75, -0.25, 90),
      leftEye: eye(-2.00, -0.25, 95),
      lensType: 'single-vision-distance', material: 'polycarbonate',
      complexity: 'simple',
      flags: [flag('paediatric', 'both', 'medium', 'Patient age 18 years < 16', 'Use polycarbonate or Trivex; expiry default 1 year')]
    }),
    rx({
      id: 'rx-012', patient: 'Linda Marsh', prescriber: 'Jane Smith',
      gocNumber: '01-12345', practiceName: 'High Street Opticians',
      birthDate: '1955-07-19',
      examinationDate: '2026-05-10', issueDate: '2026-05-10', expiryDate: '2027-05-10',
      status: 'active',
      rightEye: eye(-0.50, -0.25, 90, 2.25),
      leftEye: eye(-0.50, -0.25, 85, 2.25),
      lensType: 'varifocal', material: 'cr-39',
      complexity: 'moderate',
      flags: [
        flag('presbyopia', 'both', 'low', 'Addition prescribed (established-presbyopia)', 'Counsel patient on accommodation expectations'),
        flag('ocular-pathology', 'both', 'high', 'Ocular pathology recorded on step 10', 'Consider ophthalmology referral as documented')
      ]
    }),
    rx({
      id: 'rx-013', patient: 'Michael Owens', prescriber: 'Sarah Lin',
      gocNumber: '01-33445', practiceName: 'Park Lane Optometry',
      birthDate: '1965-10-02',
      examinationDate: '2024-06-14', issueDate: '2024-06-14', expiryDate: '2026-06-14',
      status: 'active',
      rightEye: eye(0.75, 0, null, 1.50),
      leftEye: eye(1.00, 0, null, 1.50),
      lensType: 'single-vision-near', material: 'cr-39',
      complexity: 'moderate',
      flags: [flag('presbyopia', 'both', 'low', 'Addition prescribed (early-presbyopia)', 'Counsel patient on accommodation expectations')]
    }),
    rx({
      id: 'rx-014', patient: 'Nadia Patel', prescriber: 'Mark Patel',
      gocNumber: '01-22246', practiceName: 'Bridge Vision Centre',
      birthDate: '1990-04-08',
      examinationDate: '2026-05-12', issueDate: '2026-05-12', expiryDate: '2028-05-12',
      status: 'active',
      rightEye: eye(-8.50, -1.25, 180),
      leftEye: eye(-9.00, -1.50, 5),
      lensType: 'single-vision-distance', material: 'high-index-1.74',
      complexity: 'complex',
      flags: [
        flag('high-myopia', 'right', 'medium', 'Right sphere -8.50 D below -6.00 D', 'Consider retinal screening every 12 months'),
        flag('high-myopia', 'left', 'medium', 'Left sphere -9.00 D below -6.00 D', 'Consider retinal screening every 12 months')
      ]
    }),
    rx({
      id: 'rx-015', patient: 'Oscar Quinn', prescriber: 'Jane Smith',
      gocNumber: '01-12345', practiceName: 'High Street Opticians',
      birthDate: '1982-12-25',
      examinationDate: '2026-04-18', issueDate: '2026-04-18', expiryDate: '2028-04-18',
      status: 'active',
      rightEye: eye(0.25, 0, null),
      leftEye: eye(0, -0.25, 90),
      lensType: 'single-vision-distance', material: 'cr-39',
      complexity: 'simple', flags: []
    }),
    rx({
      id: 'rx-016', patient: 'Priya Rao', prescriber: 'Sarah Lin',
      gocNumber: '01-33445', practiceName: 'Park Lane Optometry',
      birthDate: '1948-02-11',
      examinationDate: '2026-05-15', issueDate: '2026-05-15', expiryDate: '2027-05-15',
      status: 'active',
      rightEye: eye(-1.00, -0.75, 90, 3.00, 0, '', 0, ''),
      leftEye: eye(-1.25, -0.50, 95, 3.00, 0, '', 0, ''),
      lensType: 'varifocal', material: 'cr-39',
      complexity: 'moderate',
      flags: [
        flag('presbyopia', 'both', 'low', 'Addition prescribed (advanced-presbyopia)', 'Counsel patient on accommodation expectations'),
        flag('refer-ophthalmology', 'both', 'high', 'Prescriber requests ophthalmology referral', 'Cataract review')
      ]
    })
  ];

  NS.sampleData = data;
}());
