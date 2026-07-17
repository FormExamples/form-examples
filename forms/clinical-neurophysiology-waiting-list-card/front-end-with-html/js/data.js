// Sample data for the Clinical Neurophysiology Waiting List Card dashboard. Mirrors the
// SvelteKit dashboard's `src/lib/sample-data.ts`. Used standalone when the
// backend is unreachable.

  

  /** @type {import('./types.js').WaitingListCardSummary[]} */
  const samples = [
    {
      id: 'wlc-001',
      patientName: 'Alice Anderson',
      nhsNumber: '485 777 3456',
      specialty: 'Trauma & Orthopaedics',
      procedureDescription: 'Right total knee replacement',
      clinicalPriority: 'P4',
      rttClockStartDate: '2026-03-01',
      weeksWaited: 13,
      waitingTimeStatus: 'within-target',
      nextAppointmentDate: '2026-06-10',
      nextAppointmentSite: 'Royal Orthopaedic Hospital — Outpatients',
      practitionerName: 'Dr Sara Patel',
      flags: []
    },
    {
      id: 'wlc-002',
      patientName: 'Brian Brown',
      nhsNumber: '623 998 1122',
      specialty: 'General Surgery',
      procedureDescription: 'Laparoscopic cholecystectomy',
      clinicalPriority: 'P3',
      rttClockStartDate: '2026-02-15',
      weeksWaited: 15,
      waitingTimeStatus: 'approaching-breach',
      nextAppointmentDate: '2026-06-15',
      nextAppointmentSite: 'St Mary\u2019s Hospital — Day Surgery Unit',
      practitionerName: 'Mr Tom Wilkins',
      flags: [{ category: 'breach-risk', priority: 'medium' }]
    },
    {
      id: 'wlc-003',
      patientName: 'Catherine Carter',
      nhsNumber: '711 442 5566',
      specialty: 'Ophthalmology',
      procedureDescription: 'Cataract extraction, left eye',
      clinicalPriority: 'P4',
      rttClockStartDate: '2025-12-20',
      weeksWaited: 23,
      waitingTimeStatus: 'breached',
      nextAppointmentDate: '2026-06-25',
      nextAppointmentSite: 'Eye Hospital — Cataract Clinic',
      practitionerName: 'Ms Anita Singh',
      flags: [
        { category: 'breach-risk', priority: 'high' },
        { category: 'contact-details-missing', priority: 'low' }
      ]
    },
    {
      id: 'wlc-004',
      patientName: 'David Davies',
      nhsNumber: '829 555 7788',
      specialty: 'Cardiology',
      procedureDescription: 'Suspected cancer — chest mass on imaging',
      clinicalPriority: 'P2',
      rttClockStartDate: '2026-05-25',
      weeksWaited: 1,
      waitingTimeStatus: 'within-target',
      nextAppointmentDate: '2026-06-15',
      nextAppointmentSite: 'Cardiothoracic Centre — Rapid Access Clinic',
      practitionerName: 'Dr Helen Macleod',
      flags: [{ category: 'two-week-wait-cancer', priority: 'high' }]
    },
    {
      id: 'wlc-005',
      patientName: 'Eleanor Evans',
      nhsNumber: '935 110 4477',
      specialty: 'ENT',
      procedureDescription: 'Tonsillectomy',
      clinicalPriority: 'P4',
      rttClockStartDate: '2025-04-01',
      weeksWaited: 60,
      waitingTimeStatus: 'long-wait',
      nextAppointmentDate: null,
      nextAppointmentSite: '',
      practitionerName: 'Mr Rohit Singh',
      flags: [
        { category: 'long-waiter-52-week', priority: 'high' },
        { category: 'missing-appointment', priority: 'medium' }
      ]
    },
    {
      id: 'wlc-006',
      patientName: 'Farah Faruq',
      nhsNumber: '410 887 3322',
      specialty: 'Gynaecology',
      procedureDescription: 'Diagnostic hysteroscopy',
      clinicalPriority: 'P3',
      rttClockStartDate: '2026-04-10',
      weeksWaited: 7,
      waitingTimeStatus: 'within-target',
      nextAppointmentDate: '2026-06-18',
      nextAppointmentSite: 'Women\u2019s Health Centre — Outpatients',
      practitionerName: 'Dr Naomi Foster',
      flags: []
    },
    {
      id: 'wlc-007',
      patientName: 'Geraint Griffiths',
      nhsNumber: '558 003 9911',
      specialty: 'Dermatology',
      procedureDescription: 'Suspected melanoma — excision biopsy',
      clinicalPriority: 'P2',
      rttClockStartDate: '2026-05-20',
      weeksWaited: 1,
      waitingTimeStatus: 'within-target',
      nextAppointmentDate: '2026-06-20',
      nextAppointmentSite: 'Skin Cancer Clinic',
      practitionerName: 'Dr Cerys Llewellyn',
      flags: [{ category: 'two-week-wait-cancer', priority: 'high' }]
    },
    {
      id: 'wlc-008',
      patientName: 'Harriet Hughes',
      nhsNumber: '672 224 4488',
      specialty: 'Pain Management',
      procedureDescription: 'Lumbar facet joint injection',
      clinicalPriority: 'P5',
      rttClockStartDate: '2026-01-12',
      weeksWaited: 20,
      waitingTimeStatus: 'within-target',
      nextAppointmentDate: '2026-08-01',
      nextAppointmentSite: 'Pain Clinic — Day Procedure Suite',
      practitionerName: 'Dr Mark Hollister',
      flags: []
    },
    {
      id: 'wlc-009',
      patientName: 'Ian Ingram',
      nhsNumber: '789 110 6655',
      specialty: 'Trauma & Orthopaedics',
      procedureDescription: 'Hip arthroplasty, left',
      clinicalPriority: 'P4',
      rttClockStartDate: '2025-10-05',
      weeksWaited: 34,
      waitingTimeStatus: 'breached',
      nextAppointmentDate: '2026-07-10',
      nextAppointmentSite: 'Orthopaedic Surgery Centre',
      practitionerName: 'Mr Edward Cole',
      flags: [{ category: 'breach-risk', priority: 'high' }]
    },
    {
      id: 'wlc-010',
      patientName: 'Joanna Jefferson',
      nhsNumber: '801 555 0099',
      specialty: 'Urology',
      procedureDescription: 'Flexible cystoscopy',
      clinicalPriority: 'P1b',
      rttClockStartDate: '2026-05-30',
      weeksWaited: 0,
      waitingTimeStatus: 'within-target',
      nextAppointmentDate: '2026-06-01',
      nextAppointmentSite: 'Urology Day Unit',
      practitionerName: 'Dr Anna Reid',
      flags: []
    }
  ];

  

export { samples as sampleCards };
