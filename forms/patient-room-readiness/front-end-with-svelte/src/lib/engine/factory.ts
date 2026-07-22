import type { PatientRoomReadinessChecklist } from './types.js';

/**
 * Build a fresh, fully-blank room-readiness checklist.
 * Strings default to `''`; every checkpoint boolean defaults to `false`.
 */
export function createEmptyChecklist(): PatientRoomReadinessChecklist {
  return {
    location: {
      buildingNameOrNumber: '',
      roomNameOrNumber: '',
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
      doorKnobsStopper: false,
    },
    inspector: {
      name: '',
      email: '',
    },
    inspection: {
      date: '',
      time: '',
    },
  };
}
