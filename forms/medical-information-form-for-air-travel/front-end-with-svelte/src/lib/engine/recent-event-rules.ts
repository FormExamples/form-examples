import type { FiredRule, MedifAssessment } from './types.js';
import { daysBetween } from './utils.js';

// Rules driven by Step 9 (recent events / surgery) and Step 7 cardio acute
// events. The recovery windows below follow the most conservative IATA
// member-airline thresholds.

interface RecentRule {
  id: string;
  band: FiredRule['band'];
  description: string;
  fires: (d: MedifAssessment) => boolean;
}

const RULES: RecentRule[] = [
  {
    id: 'R-RE-01',
    band: 'unfit-to-fly',
    description: 'Acute MI within 7 days',
    fires: (d) => {
      const n = daysBetween(d.cardiovascular.recentMiDate);
      return n !== null && n >= 0 && n < 7;
    },
  },
  {
    id: 'R-RE-02',
    band: 'requires-review',
    description: 'Acute MI 7–21 days ago',
    fires: (d) => {
      const n = daysBetween(d.cardiovascular.recentMiDate);
      return n !== null && n >= 7 && n <= 21;
    },
  },
  {
    id: 'R-RE-03',
    band: 'unfit-to-fly',
    description: 'Pneumothorax within 14 days (cabin gas expansion risk)',
    fires: (d) => {
      const n = daysBetween(d.respiratory.recentPneumothoraxDate);
      return n !== null && n >= 0 && n < 14;
    },
  },
  {
    id: 'R-RE-04',
    band: 'unfit-to-fly',
    description: 'Recent intra-ocular, intra-cranial, or intra-abdominal gas — expansion at altitude',
    fires: (d) =>
      d.recentEvents.cabinGasRisk === 'intra-ocular-gas' ||
      d.recentEvents.cabinGasRisk === 'intra-cranial-gas' ||
      d.recentEvents.cabinGasRisk === 'intra-abdominal-gas',
  },
  {
    id: 'R-RE-05',
    band: 'requires-review',
    description: 'Recent abdominal or thoracic surgery within 10 days',
    fires: (d) => {
      const n = daysBetween(d.recentEvents.lastSurgeryDate);
      return n !== null && n >= 0 && n <= 10;
    },
  },
  {
    id: 'R-RE-06',
    band: 'fit-with-conditions',
    description: 'Recent surgery 11–14 days ago — documented healing required',
    fires: (d) => {
      const n = daysBetween(d.recentEvents.lastSurgeryDate);
      return n !== null && n >= 11 && n <= 14;
    },
  },
  {
    id: 'R-RE-07',
    band: 'requires-review',
    description: 'Pulmonary embolism within 6 weeks',
    fires: (d) => {
      const n = daysBetween(d.respiratory.recentPulmonaryEmbolismDate);
      return n !== null && n >= 0 && n < 42;
    },
  },
  {
    id: 'R-RE-08',
    band: 'requires-review',
    description: 'Deep vein thrombosis within 4 weeks',
    fires: (d) => {
      const n = daysBetween(d.recentEvents.recentDvtDate);
      return n !== null && n >= 0 && n < 28;
    },
  },
  {
    id: 'R-RE-09',
    band: 'requires-review',
    description: 'Stroke within 14 days',
    fires: (d) => {
      const n = daysBetween(d.recentEvents.recentStrokeDate);
      return n !== null && n >= 0 && n < 14;
    },
  },
  {
    id: 'R-RE-10',
    band: 'unfit-to-fly',
    description: 'Scuba diving within 24 hours of departure — decompression risk',
    fires: (d) => d.recentEvents.scubaDivingWithin24h === 'yes',
  },
  {
    id: 'R-RE-11',
    band: 'fit-with-conditions',
    description: 'Recent fracture with plaster cast in situ — split cast or seat allocation required',
    fires: (d) => d.recentEvents.recentFractureCast === 'yes',
  },
];

export function applyRecentEventRules(data: MedifAssessment): FiredRule[] {
  const fired: FiredRule[] = [];
  for (const r of RULES) {
    if (r.fires(data)) {
      fired.push({
        ruleId: r.id,
        category: 'recent-event',
        band: r.band,
        description: r.description,
      });
    }
  }
  return fired;
}
