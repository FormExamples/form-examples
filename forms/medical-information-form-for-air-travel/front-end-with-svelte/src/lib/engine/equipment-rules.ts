import type { FiredRule, MedifAssessment } from './types.js';

// Rules driven by Step 12 (in-flight equipment) and Step 13 (cabin medications).
// The presence of in-flight equipment generally moves the form into
// `fit-with-conditions` or `requires-review` depending on complexity.

interface EquipmentRule {
  id: string;
  band: FiredRule['band'];
  description: string;
  fires: (d: MedifAssessment) => boolean;
}

const RULES: EquipmentRule[] = [
  {
    id: 'R-EQ-01',
    band: 'fit-with-conditions',
    description: 'Supplemental oxygen requested at low flow (≤ 4 L/min sustained)',
    fires: (d) =>
      d.inflightNeeds.requiresSupplementalOxygen === 'yes' &&
      (d.inflightNeeds.oxygenFlowRateLpm ?? 0) > 0 &&
      (d.inflightNeeds.oxygenFlowRateLpm ?? 0) <= 4,
  },
  {
    id: 'R-EQ-02',
    band: 'requires-review',
    description: 'Supplemental oxygen flow > 4 L/min sustained — dangerous-goods declaration required',
    fires: (d) =>
      d.inflightNeeds.requiresSupplementalOxygen === 'yes' &&
      (d.inflightNeeds.oxygenFlowRateLpm ?? 0) > 4,
  },
  {
    id: 'R-EQ-03',
    band: 'fit-with-conditions',
    description: 'Portable oxygen concentrator (POC) requested — battery audit required',
    fires: (d) => d.inflightNeeds.requiresPoc === 'yes',
  },
  {
    id: 'R-EQ-04',
    band: 'requires-review',
    description: 'POC battery duration insufficient for sector + 50% safety margin',
    fires: (d) => {
      if (d.inflightNeeds.requiresPoc !== 'yes') return false;
      const hours = d.inflightNeeds.pocBatteryHours;
      const minutes = d.trip.sectorDurationMinutes;
      if (hours === null || minutes === null) return false;
      const requiredHours = (minutes / 60) * 1.5;
      return hours < requiredHours;
    },
  },
  {
    id: 'R-EQ-05',
    band: 'requires-review',
    description: 'Stretcher requested — sector-specific approval required',
    fires: (d) => d.inflightNeeds.requiresStretcher === 'yes',
  },
  {
    id: 'R-EQ-06',
    band: 'requires-review',
    description: 'Infant incubator requested — sector-specific approval required',
    fires: (d) => d.inflightNeeds.requiresIncubator === 'yes',
  },
  {
    id: 'R-EQ-07',
    band: 'requires-review',
    description: 'IV pump or other battery-powered device — IATA DGR clearance required',
    fires: (d) =>
      d.inflightNeeds.requiresIvPump === 'yes' ||
      d.cabinMeds.dangerousGoodsBatteryDeclaration === 'yes',
  },
  {
    id: 'R-EQ-08',
    band: 'fit-with-conditions',
    description: 'Medical escort requested — flight crew briefing required',
    fires: (d) => d.inflightNeeds.requiresMedicalEscort === 'yes',
  },
  {
    id: 'R-EQ-09',
    band: 'fit-with-conditions',
    description: 'Wheelchair assistance to / from / within aircraft',
    fires: (d) =>
      d.inflightNeeds.wheelchairType === 'WCHR' ||
      d.inflightNeeds.wheelchairType === 'WCHS' ||
      d.inflightNeeds.wheelchairType === 'WCHC',
  },
];

export function applyEquipmentRules(data: MedifAssessment): FiredRule[] {
  const fired: FiredRule[] = [];
  for (const r of RULES) {
    if (r.fires(data)) {
      fired.push({
        ruleId: r.id,
        category: 'equipment',
        band: r.band,
        description: r.description,
      });
    }
  }
  return fired;
}
