// Hospital Daily Monitoring Checklist — the 97-checkpoint catalogue,
// transcribed verbatim from ../spec/index.md (the canonical, hand-maintained
// source). Keep this file and spec/index.md in sync: if the spec changes,
// this file (and front-end-with-svelte/src/lib/config/items.ts) must change
// with it.
//
// Each entry: { id, section, sectionTitle, subsection?, text }
//   id           — stable dotted identifier from the source proforma
//                  ('1.1', '6.1.1', '20.10', '15', ...)
//   section      — section number, 1..22
//   sectionTitle — the section's heading text
//   subsection   — optional sub-heading (only section 6 has these:
//                  '6.1 Pathology Lab', '6.2 Radio Imaging')
//   text         — the checkpoint's full text

const CHECKLIST_ITEMS = [
  // 1. OPD
  { id: '1.1', section: 1, sectionTitle: 'OPD', text: "Reception & Help Desk — patient guidance, information regarding services & doctor." },
  { id: '1.2', section: 1, sectionTitle: 'OPD', text: "Registration — availability as per mode of staff, stationary, prescription slips, HMIS (hospital statistics)." },
  { id: '1.3', section: 1, sectionTitle: 'OPD', text: "Senior Citizen Counter display." },
  { id: '1.4', section: 1, sectionTitle: 'OPD', text: "Complaint Box." },
  { id: '1.5', section: 1, sectionTitle: 'OPD', text: "Chambers of Doctors & Specialist, patient's sitting arrangement, patient disposal." },
  { id: '1.6', section: 1, sectionTitle: 'OPD', text: "Dispensary — availability of drugs, pharmacist, duty roster." },
  { id: '1.7', section: 1, sectionTitle: 'OPD', text: "Grievance redressal by RMO / Superintendent." },
  { id: '1.8', section: 1, sectionTitle: 'OPD', text: "Minor O.T. — dressing material, instruments, sterilised drums, gloves etc." },
  { id: '1.9', section: 1, sectionTitle: 'OPD', text: "Plaster room, injection room — availability of material & performance status." },
  { id: '1.10', section: 1, sectionTitle: 'OPD', text: "Referral register." },
  { id: '1.11', section: 1, sectionTitle: 'OPD', text: "Enquire whether patients are getting medicine or not." },

  // 2. Causality
  { id: '2.1', section: 2, sectionTitle: 'Causality', text: "Availability of doctor, nurse, compounder, other support staff duty roster. CMO daily report." },
  { id: '2.2', section: 2, sectionTitle: 'Causality', text: "Availability of emergency tray having drugs, oxygen, ambu-bag, suction, equipment functioning, support staff, duty roster." },
  { id: '2.3', section: 2, sectionTitle: 'Causality', text: "Status of emergency ward." },
  { id: '2.4', section: 2, sectionTitle: 'Causality', text: "Skill of medical / paramedical in life-saving practices, emergency ward, emergency box having drugs, stitching material, dressing material for disaster." },

  // 3. Dispensary
  { id: '3.1', section: 3, sectionTitle: 'Dispensary', text: "Availability of sufficient drug stock." },
  { id: '3.2', section: 3, sectionTitle: 'Dispensary', text: "Stock book entry, daily expenditure entry verification." },
  { id: '3.3', section: 3, sectionTitle: 'Dispensary', text: "Drug dispensing in envelopes." },

  // 4. H.R. status check attendance
  { id: '4.1', section: 4, sectionTitle: 'H.R. status check attendance', text: "Medical, para medical." },
  { id: '4.2', section: 4, sectionTitle: 'H.R. status check attendance', text: "Support staff, behaviour of staff among colleagues and with patient." },

  // 5. Ambulance
  { id: '5.1', section: 5, sectionTitle: 'Ambulance', text: "24x7 availability & functioning, diesel, petrol." },
  { id: '5.2', section: 5, sectionTitle: 'Ambulance', text: "Driver — available round the clock." },
  { id: '5.3', section: 5, sectionTitle: 'Ambulance', text: "Daily log book verification." },

  // 6. Diagnostic Facility — 6.1 Pathology Lab
  { id: '6.1.1', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.1 Pathology Lab', text: "Staff." },
  { id: '6.1.2', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.1 Pathology Lab', text: "Equipments & their functioning status." },
  { id: '6.1.3', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.1 Pathology Lab', text: "Consumables." },
  { id: '6.1.4', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.1 Pathology Lab', text: "Whether range of investigation is consistent with the medical services provided." },
  { id: '6.1.5', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.1 Pathology Lab', text: "Reports — whether being released in time to O.P.D. / wards." },
  // 6. Diagnostic Facility — 6.2 Radio Imaging
  { id: '6.2.1', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.2 Radio Imaging', text: "X-ray / CT scan machine & functioning status." },
  { id: '6.2.2', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.2 Radio Imaging', text: "Availability and quality of fixer developer, X-ray film." },
  { id: '6.2.3', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.2 Radio Imaging', text: "USG — functioning status." },
  { id: '6.2.4', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.2 Radio Imaging', text: "Radiation Safety Officer nominated." },
  { id: '6.2.5', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.2 Radio Imaging', text: "Reports — whether being released in time to OPD / ward." },
  { id: '6.2.6', section: 6, sectionTitle: 'Diagnostic Facility', subsection: '6.2 Radio Imaging', text: "Status of Radiation Protection Protocol, badges being regularly used." },

  // 7. Store
  { id: '7.1', section: 7, sectionTitle: 'Store', text: "Store keeper / pharmacist — availability." },
  { id: '7.2', section: 7, sectionTitle: 'Store', text: "Storage of drugs in order, cleanliness." },
  { id: '7.3', section: 7, sectionTitle: 'Store', text: "Security status." },
  { id: '7.4', section: 7, sectionTitle: 'Store', text: "Drugs — sample stock check, expiry (FEFO)." },

  // 8. O.T. / ICU
  { id: '8.1', section: 8, sectionTitle: 'O.T. / ICU', text: "Anaesthetist — specialist / M.O." },
  { id: '8.2', section: 8, sectionTitle: 'O.T. / ICU', text: "Support staff." },
  { id: '8.3', section: 8, sectionTitle: 'O.T. / ICU', text: "Functioning status of equipment." },
  { id: '8.4', section: 8, sectionTitle: 'O.T. / ICU', text: "Duty roster, OT checklist, infection control measures — fumigation / culture." },
  { id: '8.5', section: 8, sectionTitle: 'O.T. / ICU', text: "Emergency / OT drugs / sterilization of linen / instrument." },

  // 9. Labour Room
  { id: '9.1', section: 9, sectionTitle: 'Labour Room', text: "Availability of staff, drugs, five trays." },
  { id: '9.2', section: 9, sectionTitle: 'Labour Room', text: "Availability & status of resuscitation equipment." },
  { id: '9.3', section: 9, sectionTitle: 'Labour Room', text: "Status of labour table, mattress, macintosh." },
  { id: '9.4', section: 9, sectionTitle: 'Labour Room', text: "Cleanliness status, availability of dustbins, water supply etc." },

  // 10. Wards
  { id: '10.1', section: 10, sectionTitle: 'Wards', text: "Status of mattress, sheets, drugs." },
  { id: '10.2', section: 10, sectionTitle: 'Wards', text: "Staff — regular rounds by medical officer / specialist to be ensured." },
  { id: '10.3', section: 10, sectionTitle: 'Wards', text: "Record keeping — drugs, case sheet etc." },
  { id: '10.4', section: 10, sectionTitle: 'Wards', text: "Nursing & support staff." },
  { id: '10.5', section: 10, sectionTitle: 'Wards', text: "Enquire patients regarding services, behaviour of the staff." },

  // 11. House Keeping
  { id: '11.1', section: 11, sectionTitle: 'House Keeping', text: "OPD." },
  { id: '11.2', section: 11, sectionTitle: 'House Keeping', text: "Wards." },
  { id: '11.3', section: 11, sectionTitle: 'House Keeping', text: "OT / ICU." },
  { id: '11.4', section: 11, sectionTitle: 'House Keeping', text: "L.R." },
  { id: '11.5', section: 11, sectionTitle: 'House Keeping', text: "Premises." },
  { id: '11.6', section: 11, sectionTitle: 'House Keeping', text: "Drainages." },
  { id: '11.7', section: 11, sectionTitle: 'House Keeping', text: "Toilets cleanliness, lights." },
  { id: '11.8', section: 11, sectionTitle: 'House Keeping', text: "Toilets for OPD patients, use of disinfectants." },

  // 12. Water Supply
  { id: '12.1', section: 12, sectionTitle: 'Water Supply', text: "Drinking water RO / aqua guard." },
  { id: '12.2', section: 12, sectionTitle: 'Water Supply', text: "Water cooler — maintenance." },
  { id: '12.3', section: 12, sectionTitle: 'Water Supply', text: "Overhead tanks." },
  { id: '12.4', section: 12, sectionTitle: 'Water Supply', text: "Taps & fittings, leakages." },
  { id: '12.5', section: 12, sectionTitle: 'Water Supply', text: "Washroom." },
  { id: '12.6', section: 12, sectionTitle: 'Water Supply', text: "Washbasins." },

  // 13. Electric Supply
  { id: '13.1', section: 13, sectionTitle: 'Electric Supply', text: "General — switches, wiring, lights." },
  { id: '13.2', section: 13, sectionTitle: 'Electric Supply', text: "Generator functional status." },
  { id: '13.3', section: 13, sectionTitle: 'Electric Supply', text: "Availability of electrician during routine / emergency hours." },

  // 14. Diet
  { id: '14.1', section: 14, sectionTitle: 'Diet', text: "Availability of staff." },
  { id: '14.2', section: 14, sectionTitle: 'Diet', text: "Availability of food items & timings of food supply." },
  { id: '14.3', section: 14, sectionTitle: 'Diet', text: "Utensils — availability & cleanliness." },
  { id: '14.4', section: 14, sectionTitle: 'Diet', text: "Food trolley." },
  { id: '14.5', section: 14, sectionTitle: 'Diet', text: "Water supply." },
  { id: '14.6', section: 14, sectionTitle: 'Diet', text: "General cleanliness." },

  // 15. Hospital Signage
  { id: '15', section: 15, sectionTitle: 'Hospital Signage', text: "Hospital signage, display boards, timings display." },

  // 16. Fire Fighting Equipment
  { id: '16', section: 16, sectionTitle: 'Fire Fighting Equipment', text: "Fire fighting equipment." },

  // 17. Patient Feedback
  { id: '17', section: 17, sectionTitle: 'Patient Feedback', text: "Patient's / attendant's feedback." },

  // 18. Mortuary
  { id: '18', section: 18, sectionTitle: 'Mortuary', text: "Care of dead / mortuary arrangements / post-mortem." },

  // 19. Hospital Furniture
  { id: '19', section: 19, sectionTitle: 'Hospital Furniture', text: "Hospital furniture." },

  // 20. Hospital Waste Management
  { id: '20.1', section: 20, sectionTitle: 'Hospital Waste Management', text: "Collection." },
  { id: '20.2', section: 20, sectionTitle: 'Hospital Waste Management', text: "Segregation." },
  { id: '20.3', section: 20, sectionTitle: 'Hospital Waste Management', text: "Maintenance of record." },
  { id: '20.4', section: 20, sectionTitle: 'Hospital Waste Management', text: "Transportation." },
  { id: '20.5', section: 20, sectionTitle: 'Hospital Waste Management', text: "Disposal if in-house, whether protocol is followed." },
  { id: '20.6', section: 20, sectionTitle: 'Hospital Waste Management', text: "Destruction & disposal of sharps." },
  { id: '20.7', section: 20, sectionTitle: 'Hospital Waste Management', text: "Destruction & disinfection of rubber, glass & plastics." },
  { id: '20.8', section: 20, sectionTitle: 'Hospital Waste Management', text: "Colour-coded bins are in place in OPD, in wards." },
  { id: '20.9', section: 20, sectionTitle: 'Hospital Waste Management', text: "Regular changing of polythenes." },
  { id: '20.10', section: 20, sectionTitle: 'Hospital Waste Management', text: "Use of protective gear, boots, apron etc by staff." },

  // 21. Observance & Practice of Infection Control Protocols
  { id: '21.1', section: 21, sectionTitle: 'Observance & Practice of Infection Control Protocols', text: "In O.T." },
  { id: '21.2', section: 21, sectionTitle: 'Observance & Practice of Infection Control Protocols', text: "In ICU." },
  { id: '21.3', section: 21, sectionTitle: 'Observance & Practice of Infection Control Protocols', text: "In L.R." },
  { id: '21.4', section: 21, sectionTitle: 'Observance & Practice of Infection Control Protocols', text: "Hand wash practice." },
  { id: '21.5', section: 21, sectionTitle: 'Observance & Practice of Infection Control Protocols', text: "Protective gloves, apron etc." },

  // 22. Record Room
  { id: '22.1', section: 22, sectionTitle: 'Record Room', text: "Cleanliness / pests / rodents." },
  { id: '22.2', section: 22, sectionTitle: 'Record Room', text: "Proper filing, stocking." },
];

// One { number, title } pair per section, in catalogue order — derived from
// CHECKLIST_ITEMS so the two can never drift apart.
const SECTIONS = (function () {
  const seen = new Map();
  CHECKLIST_ITEMS.forEach(function (item) {
    if (!seen.has(item.section)) {
      seen.set(item.section, { number: item.section, title: item.sectionTitle });
    }
  });
  return Array.from(seen.values());
})();

export { CHECKLIST_ITEMS, SECTIONS };
