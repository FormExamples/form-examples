// Sample prescription rows for the eye-prescription dashboard.
// Shape mirrors the data the SvelteKit form would produce, projected
// down to the columns the dashboard needs. Spans simple/moderate/complex
// complexity, every flag category, several lens types, and a mix of
// expired vs. active prescriptions.

export type Complexity = 'simple' | 'moderate' | 'complex';
export type Priority = 'low' | 'medium' | 'high';

export interface DashboardFlag {
  category: string;
  eye: 'right' | 'left' | 'both';
  priority: Priority;
  description: string;
  suggestedAction: string;
}

export interface DashboardEye {
  sphereDiopters: number | null;
  cylinderDiopters: number | null;
  axisDegrees: number | null;
  additionDiopters: number | null;
  prismHorizontalDiopters: number;
  baseHorizontal: '' | 'in' | 'out';
  prismVerticalDiopters: number;
  baseVertical: '' | 'up' | 'down';
}

export interface PrescriptionRow {
  id: string;
  patientName: string;
  patientDob: string;
  prescriberName: string;
  prescriberGoc: string;
  practiceName: string;
  examinationDate: string;
  issueDate: string;
  expiryDate: string;
  reasonForSightTest: string;
  status: 'active' | 'cancelled' | 'superseded' | 'expired' | 'entered-in-error' | 'draft';
  rightEye: DashboardEye;
  leftEye: DashboardEye;
  lensType: string;
  material: string;
  complexity: Complexity;
  flags: DashboardFlag[];
}

function eye(
  sph: number | null, cyl: number | null, axis: number | null,
  add: number | null = null,
  prismH = 0, baseH: DashboardEye['baseHorizontal'] = '',
  prismV = 0, baseV: DashboardEye['baseVertical'] = '',
): DashboardEye {
  return {
    sphereDiopters: sph,
    cylinderDiopters: cyl,
    axisDegrees: axis,
    additionDiopters: add,
    prismHorizontalDiopters: prismH,
    baseHorizontal: baseH,
    prismVerticalDiopters: prismV,
    baseVertical: baseV,
  };
}

function flag(
  category: string, eye: DashboardFlag['eye'], priority: Priority,
  description: string, action: string,
): DashboardFlag {
  return { category, eye, priority, description, suggestedAction: action };
}

export const SAMPLE_PRESCRIPTIONS: PrescriptionRow[] = [
  {
    id: 'rx-001', patientName: 'Alice Bennett', patientDob: '1985-04-12',
    prescriberName: 'Jane Smith', prescriberGoc: '01-12345', practiceName: 'High Street Opticians',
    examinationDate: '2025-09-14', issueDate: '2025-09-14', expiryDate: '2027-09-14',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(-1.50, -0.25, 175), leftEye: eye(-1.25, 0, null),
    lensType: 'single-vision-distance', material: 'cr-39',
    complexity: 'simple', flags: [],
  },
  {
    id: 'rx-002', patientName: 'Brian Carter', patientDob: '1962-11-03',
    prescriberName: 'Mark Patel', prescriberGoc: '01-22246', practiceName: 'Bridge Vision Centre',
    examinationDate: '2026-01-20', issueDate: '2026-01-20', expiryDate: '2028-01-20',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(2.25, -0.75, 90, 2.00), leftEye: eye(2.50, -0.50, 95, 2.00),
    lensType: 'varifocal', material: 'high-index-1.67',
    complexity: 'moderate',
    flags: [flag('presbyopia', 'both', 'low',
      'Addition prescribed (established-presbyopia)',
      'Counsel patient on accommodation expectations')],
  },
  {
    id: 'rx-003', patientName: 'Catherine Du', patientDob: '1978-02-28',
    prescriberName: 'Jane Smith', prescriberGoc: '01-12345', practiceName: 'High Street Opticians',
    examinationDate: '2025-11-04', issueDate: '2025-11-04', expiryDate: '2027-11-04',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(-7.50, -2.75, 90, 2.00, 1.00, 'in'), leftEye: eye(-2.00, -0.50, 180, 2.00),
    lensType: 'varifocal', material: 'high-index-1.74',
    complexity: 'complex',
    flags: [
      flag('high-myopia', 'right', 'medium', 'Right sphere -7.50 D below -6.00 D',
        'Consider retinal screening every 12 months'),
      flag('high-astigmatism', 'right', 'medium', 'Right cylinder -2.75 D magnitude > 2.50 D',
        'Consider corneal topography; rule out keratoconus'),
      flag('anisometropia', 'both', 'medium', 'Anisometropia 5.50 D > 2.00 D',
        'Adaptation period expected; consider contact-lens correction'),
      flag('prism-present', 'both', 'medium', 'Prism prescribed in one or both eyes',
        'Document indication; review binocular vision'),
      flag('presbyopia', 'both', 'low', 'Addition prescribed (established-presbyopia)',
        'Counsel patient on accommodation expectations'),
    ],
  },
  {
    id: 'rx-004', patientName: 'Daniel Evans', patientDob: '2015-07-10',
    prescriberName: 'Mark Patel', prescriberGoc: '01-22246', practiceName: 'Bridge Vision Centre',
    examinationDate: '2026-03-02', issueDate: '2026-03-02', expiryDate: '2027-03-02',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(-3.50, -1.00, 10), leftEye: eye(-3.75, -0.75, 170),
    lensType: 'single-vision-distance', material: 'polycarbonate',
    complexity: 'moderate',
    flags: [flag('paediatric', 'both', 'medium', 'Patient age 10 years < 16',
      'Use polycarbonate or Trivex; expiry default 1 year')],
  },
  {
    id: 'rx-005', patientName: 'Evelyn Foster', patientDob: '1951-09-22',
    prescriberName: 'Sarah Lin', prescriberGoc: '01-33445', practiceName: 'Park Lane Optometry',
    examinationDate: '2023-04-15', issueDate: '2023-04-15', expiryDate: '2024-04-15',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(1.25, -0.50, 90, 2.50), leftEye: eye(1.50, -0.25, 85, 2.50),
    lensType: 'bifocal', material: 'cr-39',
    complexity: 'moderate',
    flags: [
      flag('presbyopia', 'both', 'low', 'Addition prescribed (established-presbyopia)',
        'Counsel patient on accommodation expectations'),
      flag('prescription-expired', 'both', 'high', 'Expiry date 2024-04-15 is in the past',
        'Schedule a new sight test before dispensing'),
    ],
  },
  {
    id: 'rx-006', patientName: 'Farah Ghani', patientDob: '1995-12-01',
    prescriberName: 'Jane Smith', prescriberGoc: '01-12345', practiceName: 'High Street Opticians',
    examinationDate: '2026-02-10', issueDate: '2026-02-10', expiryDate: '2028-02-10',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(0, 0, null), leftEye: eye(-0.25, 0, null),
    lensType: 'single-vision-distance', material: 'cr-39',
    complexity: 'simple', flags: [],
  },
  {
    id: 'rx-007', patientName: 'George Holt', patientDob: '1969-06-18',
    prescriberName: 'Mark Patel', prescriberGoc: '01-22246', practiceName: 'Bridge Vision Centre',
    examinationDate: '2026-04-22', issueDate: '2026-04-22', expiryDate: '2028-04-22',
    reasonForSightTest: 'symptoms', status: 'active',
    rightEye: eye(-2.00, -1.50, 175, 1.50), leftEye: eye(-2.25, -1.25, 5, 1.50),
    lensType: 'occupational-varifocal', material: 'high-index-1.67',
    complexity: 'moderate',
    flags: [flag('presbyopia', 'both', 'low', 'Addition prescribed (early-presbyopia)',
      'Counsel patient on accommodation expectations')],
  },
  {
    id: 'rx-008', patientName: 'Hannah Iqbal', patientDob: '1940-03-30',
    prescriberName: 'Sarah Lin', prescriberGoc: '01-33445', practiceName: 'Park Lane Optometry',
    examinationDate: '2026-05-01', issueDate: '2026-05-01', expiryDate: '2027-05-01',
    reasonForSightTest: 'follow-up', status: 'active',
    rightEye: eye(5.50, -0.75, 95, 2.75), leftEye: eye(5.25, -0.50, 100, 2.75),
    lensType: 'varifocal', material: 'high-index-1.67',
    complexity: 'complex',
    flags: [
      flag('high-hyperopia', 'right', 'medium', 'Right sphere +5.50 D above +5.00 D',
        'Assess angle-closure risk; gonioscopy if indicated'),
      flag('high-hyperopia', 'left', 'medium', 'Left sphere +5.25 D above +5.00 D',
        'Assess angle-closure risk; gonioscopy if indicated'),
      flag('presbyopia', 'both', 'low', 'Addition prescribed (advanced-presbyopia)',
        'Counsel patient on accommodation expectations'),
    ],
  },
  {
    id: 'rx-009', patientName: 'Imran Joshi', patientDob: '1989-08-14',
    prescriberName: 'Jane Smith', prescriberGoc: '01-12345', practiceName: 'High Street Opticians',
    examinationDate: '2026-03-30', issueDate: '2026-03-30', expiryDate: '2028-03-30',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(-4.25, -3.50, 170), leftEye: eye(-4.00, -3.25, 12),
    lensType: 'single-vision-distance', material: 'high-index-1.67',
    complexity: 'complex',
    flags: [
      flag('high-astigmatism', 'right', 'medium', 'Right cylinder -3.50 D magnitude > 2.50 D',
        'Consider corneal topography; rule out keratoconus'),
      flag('high-astigmatism', 'left', 'medium', 'Left cylinder -3.25 D magnitude > 2.50 D',
        'Consider corneal topography; rule out keratoconus'),
    ],
  },
  {
    id: 'rx-010', patientName: 'Jessica Khan', patientDob: '1972-05-25',
    prescriberName: 'Sarah Lin', prescriberGoc: '01-33445', practiceName: 'Park Lane Optometry',
    examinationDate: '2025-12-08', issueDate: '2025-12-08', expiryDate: '2027-12-08',
    reasonForSightTest: 'routine', status: 'superseded',
    rightEye: eye(-3.00, -0.50, 90, 1.25), leftEye: eye(-3.25, -0.50, 85, 1.25),
    lensType: 'bifocal', material: 'cr-39',
    complexity: 'moderate',
    flags: [flag('presbyopia', 'both', 'low', 'Addition prescribed (early-presbyopia)',
      'Counsel patient on accommodation expectations')],
  },
  {
    id: 'rx-011', patientName: 'Karl Liu', patientDob: '2008-01-15',
    prescriberName: 'Mark Patel', prescriberGoc: '01-22246', practiceName: 'Bridge Vision Centre',
    examinationDate: '2026-04-05', issueDate: '2026-04-05', expiryDate: '2027-04-05',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(-1.75, -0.25, 90), leftEye: eye(-2.00, -0.25, 95),
    lensType: 'single-vision-distance', material: 'polycarbonate',
    complexity: 'simple',
    flags: [flag('paediatric', 'both', 'medium', 'Patient age 18 years < 16',
      'Use polycarbonate or Trivex; expiry default 1 year')],
  },
  {
    id: 'rx-012', patientName: 'Linda Marsh', patientDob: '1955-07-19',
    prescriberName: 'Jane Smith', prescriberGoc: '01-12345', practiceName: 'High Street Opticians',
    examinationDate: '2026-05-10', issueDate: '2026-05-10', expiryDate: '2027-05-10',
    reasonForSightTest: 'after-pathology', status: 'active',
    rightEye: eye(-0.50, -0.25, 90, 2.25), leftEye: eye(-0.50, -0.25, 85, 2.25),
    lensType: 'varifocal', material: 'cr-39',
    complexity: 'moderate',
    flags: [
      flag('presbyopia', 'both', 'low', 'Addition prescribed (established-presbyopia)',
        'Counsel patient on accommodation expectations'),
      flag('ocular-pathology', 'both', 'high', 'Ocular pathology recorded on step 10',
        'Consider ophthalmology referral as documented'),
    ],
  },
  {
    id: 'rx-013', patientName: 'Michael Owens', patientDob: '1965-10-02',
    prescriberName: 'Sarah Lin', prescriberGoc: '01-33445', practiceName: 'Park Lane Optometry',
    examinationDate: '2024-06-14', issueDate: '2024-06-14', expiryDate: '2026-06-14',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(0.75, 0, null, 1.50), leftEye: eye(1.00, 0, null, 1.50),
    lensType: 'single-vision-near', material: 'cr-39',
    complexity: 'moderate',
    flags: [flag('presbyopia', 'both', 'low', 'Addition prescribed (early-presbyopia)',
      'Counsel patient on accommodation expectations')],
  },
  {
    id: 'rx-014', patientName: 'Nadia Patel', patientDob: '1990-04-08',
    prescriberName: 'Mark Patel', prescriberGoc: '01-22246', practiceName: 'Bridge Vision Centre',
    examinationDate: '2026-05-12', issueDate: '2026-05-12', expiryDate: '2028-05-12',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(-8.50, -1.25, 180), leftEye: eye(-9.00, -1.50, 5),
    lensType: 'single-vision-distance', material: 'high-index-1.74',
    complexity: 'complex',
    flags: [
      flag('high-myopia', 'right', 'medium', 'Right sphere -8.50 D below -6.00 D',
        'Consider retinal screening every 12 months'),
      flag('high-myopia', 'left', 'medium', 'Left sphere -9.00 D below -6.00 D',
        'Consider retinal screening every 12 months'),
    ],
  },
  {
    id: 'rx-015', patientName: 'Oscar Quinn', patientDob: '1982-12-25',
    prescriberName: 'Jane Smith', prescriberGoc: '01-12345', practiceName: 'High Street Opticians',
    examinationDate: '2026-04-18', issueDate: '2026-04-18', expiryDate: '2028-04-18',
    reasonForSightTest: 'routine', status: 'active',
    rightEye: eye(0.25, 0, null), leftEye: eye(0, -0.25, 90),
    lensType: 'single-vision-distance', material: 'cr-39',
    complexity: 'simple', flags: [],
  },
  {
    id: 'rx-016', patientName: 'Priya Rao', patientDob: '1948-02-11',
    prescriberName: 'Sarah Lin', prescriberGoc: '01-33445', practiceName: 'Park Lane Optometry',
    examinationDate: '2026-05-15', issueDate: '2026-05-15', expiryDate: '2027-05-15',
    reasonForSightTest: 'symptoms', status: 'active',
    rightEye: eye(-1.00, -0.75, 90, 3.00), leftEye: eye(-1.25, -0.50, 95, 3.00),
    lensType: 'varifocal', material: 'cr-39',
    complexity: 'moderate',
    flags: [
      flag('presbyopia', 'both', 'low', 'Addition prescribed (advanced-presbyopia)',
        'Counsel patient on accommodation expectations'),
      flag('refer-ophthalmology', 'both', 'high', 'Prescriber requests ophthalmology referral',
        'Cataract review'),
    ],
  },
];
