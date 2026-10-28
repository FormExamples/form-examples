// Sample assessment data for the dashboard.
//
// One row per persona in examples/personas.json (the engine's own
// regression oracle), so the dashboard's offline sample data and the persona
// expectations cannot disagree. Values are the personas' exact expected
// grades; deviceName falls back to the persona name where a persona does not
// set one.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    "id": "D001",
    "date": "2026-09-01",
    "device": "Bandage class i",
    "deviceKind": "non-invasive",
    "computedClass": "I",
    "finalClass": "I",
    "classSuffix": "",
    "conformityRoute": "self-declaration",
    "determiningRule": "R-MDR-1-I",
    "readiness": "ready",
    "flags": [],
    "summary": "Adhesive bandage: Rule 1, Class I, self-declaration."
  },
  {
    "id": "D002",
    "date": "2026-09-02",
    "device": "Sterile dressing is",
    "deviceKind": "non-invasive",
    "computedClass": "I",
    "finalClass": "I",
    "classSuffix": "s",
    "conformityRoute": "notified-body-partial",
    "determiningRule": "R-MDR-1-I",
    "readiness": "ready",
    "flags": [
      "F-NB-001"
    ],
    "summary": "Sterile wound dressing: Class Is, partial notified-body route."
  },
  {
    "id": "D003",
    "date": "2026-09-03",
    "device": "Reusable scalpel ir",
    "deviceKind": "surgically-invasive",
    "computedClass": "I",
    "finalClass": "I",
    "classSuffix": "r",
    "conformityRoute": "notified-body-partial",
    "determiningRule": "R-MDR-6-I",
    "readiness": "ready",
    "flags": [
      "F-NB-001"
    ],
    "summary": "Reusable surgical scalpel: Class Ir."
  },
  {
    "id": "D004",
    "date": "2026-09-04",
    "device": "Urinary catheter iia",
    "deviceKind": "invasive-body-orifice",
    "computedClass": "IIa",
    "finalClass": "IIa",
    "classSuffix": "",
    "conformityRoute": "notified-body-full",
    "determiningRule": "R-MDR-5-IIa",
    "readiness": "ready",
    "flags": [
      "F-NB-001"
    ],
    "summary": "Short-term urinary catheter: Rule 5, Class IIa."
  },
  {
    "id": "D005",
    "date": "2026-09-05",
    "device": "Hip implant iib",
    "deviceKind": "implantable",
    "computedClass": "IIb",
    "finalClass": "IIb",
    "classSuffix": "",
    "conformityRoute": "notified-body-full",
    "determiningRule": "R-MDR-8-IIb",
    "readiness": "ready",
    "flags": [
      "F-NB-001"
    ],
    "summary": "Hip joint implant: Rule 8, Class IIb."
  },
  {
    "id": "D006",
    "date": "2026-09-06",
    "device": "Pacemaker iii",
    "deviceKind": "implantable",
    "computedClass": "III",
    "finalClass": "III",
    "classSuffix": "",
    "conformityRoute": "notified-body-full",
    "determiningRule": "R-MDR-8-III",
    "readiness": "ready",
    "flags": [
      "F-NB-001"
    ],
    "summary": "Cardiac pacemaker: implant in heart, Class III."
  },
  {
    "id": "D007",
    "date": "2026-09-07",
    "device": "Diagnostic app iia",
    "deviceKind": "software",
    "computedClass": "IIa",
    "finalClass": "IIa",
    "classSuffix": "",
    "conformityRoute": "notified-body-full",
    "determiningRule": "R-MDR-11-IIa",
    "readiness": "ready",
    "flags": [
      "F-SAMD-001",
      "F-NB-001"
    ],
    "summary": "Decision-support app, other harm: Rule 11, Class IIa."
  },
  {
    "id": "D008",
    "date": "2026-09-08",
    "device": "Insulin loop iii",
    "deviceKind": "active",
    "computedClass": "III",
    "finalClass": "III",
    "classSuffix": "",
    "conformityRoute": "notified-body-full",
    "determiningRule": "R-MDR-22-III",
    "readiness": "ready",
    "flags": [
      "F-NB-001"
    ],
    "summary": "Closed-loop insulin pump: Rule 22, Class III."
  },
  {
    "id": "D009",
    "date": "2026-09-09",
    "device": "Ivd out of scope",
    "deviceKind": "non-invasive",
    "computedClass": "",
    "finalClass": "",
    "classSuffix": "",
    "conformityRoute": "",
    "determiningRule": "",
    "readiness": "blocked",
    "flags": [
      "F-IVD-001"
    ],
    "summary": "In vitro diagnostic: blocked, IVDR applies."
  },
  {
    "id": "D010",
    "date": "2026-09-10",
    "device": "Gaps class iia",
    "deviceKind": "invasive-body-orifice",
    "computedClass": "IIa",
    "finalClass": "IIa",
    "classSuffix": "",
    "conformityRoute": "notified-body-full",
    "determiningRule": "R-MDR-5-IIa",
    "readiness": "gaps",
    "flags": [
      "F-NB-001",
      "F-RISK-001",
      "F-QMS-001"
    ],
    "summary": "Class IIa device with no risk file, no QMS: readiness gaps."
  },
  {
    "id": "D011",
    "date": "2026-09-11",
    "device": "Override down",
    "deviceKind": "implantable",
    "computedClass": "IIb",
    "finalClass": "IIa",
    "classSuffix": "",
    "conformityRoute": "notified-body-full",
    "determiningRule": "R-MDR-8-IIb",
    "readiness": "ready",
    "flags": [
      "F-OVERRIDE-001",
      "F-NB-001"
    ],
    "summary": "Assessor overrides computed IIb to IIa with reason: class-override flag."
  },
  {
    "id": "D012",
    "date": "2026-09-12",
    "device": "Software purpose blank failsafe",
    "deviceKind": "software",
    "computedClass": "IIa",
    "finalClass": "IIa",
    "classSuffix": "",
    "conformityRoute": "notified-body-full",
    "determiningRule": "R-MDR-11-IIa",
    "readiness": "ready",
    "flags": ["F-SAMD-003", "F-SAMD-001", "F-NB-001"],
    "summary": "Software with no purpose recorded: fail-safe IIa."
  }
];

export { sampleAssessments };
