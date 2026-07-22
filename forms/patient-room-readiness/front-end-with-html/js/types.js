// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Patient Room Readiness form.
//
// 25 fixed checkpoints (booleans), not a generic item map — small enough to
// stay maintainable as individual fields. See ../spec/index.md upstream for
// the full checkpoint catalogue and field-name mapping.

/**
 * Build a fresh, fully-blank room-readiness checklist.
 * Strings default to ''; booleans default to false.
 */
function emptyAssessment() {
  return {
    location: {
      buildingNameOrNumber: '',
      roomNameOrNumber: ''
    },
    checklist: {
      patientCotMattressSideRailings: false,
      attendantCotMattress: false,
      callBell: false,
      cardiacTableIvStand: false,
      hotKettleGlasses: false,
      linenPatientDress: false,
      landlineNumbers: false,
      refrigeratorFan: false,
      televisionRemote: false,
      dustbin: false,
      bathTowelHandtowels: false,
      wcDustbins: false,
      washbasinAndFittings: false,
      bucketAndMug: false,
      geyser: false,
      soapDispenser: false,
      toiletKit: false,
      windowGlassGrooves: false,
      sidewalls: false,
      curtainBlind: false,
      chairSofa: false,
      wallSeepageWaterLeakage: false,
      electricityPointsLights: false,
      ceilingTiles: false,
      doorKnobsStopper: false
    },
    inspector: {
      name: '',
      email: ''
    },
    inspection: {
      date: '',
      time: ''
    }
  };
}

/** Ordered checklist items: [field, label]. */
const CHECKLIST_ITEMS = [
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
  ['doorKnobsStopper', 'Door / Knobs / Stopper']
];

/**
 * Tally checklist results: count checked, and list unchecked field labels.
 * Pure function, no side effects.
 * @param {ReturnType<typeof emptyAssessment>} data
 */
function summariseReadiness(data) {
  const checklist = data.checklist || {};
  let checkedCount = 0;
  const uncheckedFields = [];
  for (const [field, label] of CHECKLIST_ITEMS) {
    if (checklist[field]) {
      checkedCount += 1;
    } else {
      uncheckedFields.push(label);
    }
  }
  return { checkedCount, totalCount: CHECKLIST_ITEMS.length, uncheckedFields };
}

export { emptyAssessment, CHECKLIST_ITEMS, summariseReadiness };
