// Data model for the Patient Room Readiness checklist. Mirrors
// ../../../front-end-with-html/js/types.js and forms/patient-room-readiness/spec/index.md's
// field-name mapping table exactly — keep the two in sync.
//
// 25 fixed checkpoints (booleans), not a generic item map — small enough to
// stay maintainable as individual fields (contrast with
// `hospital-daily-monitoring-checklist`'s 97-item generic map).

export interface Location {
  buildingNameOrNumber: string;
  roomNameOrNumber: string;
}

export interface RoomChecklist {
  patientCotMattressSideRailings: boolean;
  attendantCotMattress: boolean;
  callBell: boolean;
  cardiacTableIvStand: boolean;
  hotKettleGlasses: boolean;
  linenPatientDress: boolean;
  landlineNumbers: boolean;
  refrigeratorFan: boolean;
  televisionRemote: boolean;
  dustbin: boolean;
  bathTowelHandtowels: boolean;
  wcDustbins: boolean;
  washbasinAndFittings: boolean;
  bucketAndMug: boolean;
  geyser: boolean;
  soapDispenser: boolean;
  toiletKit: boolean;
  windowGlassGrooves: boolean;
  sidewalls: boolean;
  curtainBlind: boolean;
  chairSofa: boolean;
  wallSeepageWaterLeakage: boolean;
  electricityPointsLights: boolean;
  ceilingTiles: boolean;
  doorKnobsStopper: boolean;
}

export interface Inspector {
  name: string;
  email: string;
}

export interface InspectionMeta {
  date: string; // '' if unanswered
  time: string; // '' if unanswered
}

export interface PatientRoomReadinessChecklist {
  location: Location;
  checklist: RoomChecklist;
  inspector: Inspector;
  inspection: InspectionMeta;
}

/** Ordered checklist items: [field, label]. Order matches spec/index.md's table. */
export const CHECKLIST_ITEMS: [keyof RoomChecklist, string][] = [
  ['patientCotMattressSideRailings', 'Patient Cot / Mattress / side railings'],
  ['attendantCotMattress', 'Attendant Cot / Mattress'],
  ['callBell', 'Call Bell'],
  ['cardiacTableIvStand', 'Cardiac Table / IV Stand'],
  ['hotKettleGlasses', 'Hot Kettle / Glasses'],
  ['linenPatientDress', 'Linen / Patient Dress'],
  ['landlineNumbers', 'Landline / Numbers'],
  ['refrigeratorFan', 'Refrigerator / Fan'],
  ['televisionRemote', 'Television / Remote'],
  ['dustbin', 'Dustbin'],
  ['bathTowelHandtowels', 'Bath Towel / Handtowels'],
  ['wcDustbins', 'Wc / Dust bins'],
  ['washbasinAndFittings', 'Washbasin & Fittings'],
  ['bucketAndMug', 'Bucket & Mug'],
  ['geyser', 'Geyser'],
  ['soapDispenser', 'Soap Dispenser'],
  ['toiletKit', 'Toilet Kit'],
  ['windowGlassGrooves', 'Window Glass / Groves'],
  ['sidewalls', 'Sidewalls'],
  ['curtainBlind', 'Curtain / Blind'],
  ['chairSofa', 'Chair / Sofa'],
  ['wallSeepageWaterLeakage', 'Wall Seepage / Water Leakage'],
  ['electricityPointsLights', 'Electricity Points / Lights'],
  ['ceilingTiles', 'Ceiling / Tiles'],
  ['doorKnobsStopper', 'Door / Knobs / Stopper'],
];

/** Pure tally of checked vs. unchecked checkpoints. See summary.ts. */
export interface ReadinessSummary {
  checkedCount: number;
  totalCount: number;
  uncheckedFields: string[];
}
