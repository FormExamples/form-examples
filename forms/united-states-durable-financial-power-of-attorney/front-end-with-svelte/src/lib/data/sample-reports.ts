import type { PowerOfAttorney, ValidityClass } from '#lib/engine/types.js';
import { validateInstrument } from '#lib/engine/dpoa-grader.js';
import { createDefaultInstrument } from '#lib/engine/defaults.js';
import { GRANT_FIELDS, HOT_FIELDS } from '#lib/engine/dpoa-rules.js';

/** A sample instrument plan: an identifier and the full data the engine grades. */
export interface SampleInstrument {
  id: string;
  principalName: string;
  agentName: string;
  updatedDate: string;
  data: PowerOfAttorney;
}

/** A row in the readiness dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  state: string;
  principalName: string;
  agentName: string;
  validityClass: ValidityClass;
  governingState: string;
  flagCount: number;
  updatedDate: string;
}

function base(
  principalName: string,
  state: string,
  agentName: string,
  hot: string[] = []
): PowerOfAttorney {
  const d = createDefaultInstrument();
  d.principal = {
    principalName,
    dateOfBirth: '1948-03-14',
    state,
    principalAddress: '',
    capacityConfirmed: 'yes'
  };
  d.instrument = {
    durableStatement: 'yes',
    effectiveness: 'immediate',
    springingTrigger: '',
    statutoryNoticeIncluded: 'yes'
  };
  d.agents = {
    agentName,
    agentRelationship: 'child',
    agentIsAdult: 'yes',
    agentSignedAcknowledgment: 'yes',
    successorAgentName: 'Successor Agent',
    coAgentsMode: 'sole',
    compensation: 'none',
    compensationAmount: null
  };
  for (const f of GRANT_FIELDS) d.authority[f] = 'yes';
  for (const f of HOT_FIELDS) d.authority[f] = hot.includes(f) ? 'yes' : 'no';
  d.authority.hotPowersInitialed = 'yes';
  d.authority.giftLimitType = hot.includes('hotGift') ? 'annual-exclusion' : 'none';
  d.authority.selfGiftingAllowed = 'no';
  d.execution = { notaryArranged: 'yes', witnessCount: 2, witnessIsAgent: 'no' };
  d.acceptance = { usedForRealEstate: 'no', bankFormCompleted: 'yes', form2848Status: 'filed' };
  return d;
}

/** Ready to execute: Texas, notarized, gift cap, Form 2848 filed. */
function readyTexas(): PowerOfAttorney {
  const d = base('Alvarez, Elena', 'TX', 'Marco Alvarez', ['hotGift']);
  d.execution = { notaryArranged: 'yes', witnessCount: 0, witnessIsAgent: 'no' };
  return d;
}

/** Execution risk: Florida springing power with uninitialed hot powers. */
function riskFlorida(): PowerOfAttorney {
  const d = base('Brooks, Harold', 'FL', 'Diane Brooks', ['hotGift', 'hotCreateTrust']);
  d.instrument.effectiveness = 'springing';
  d.instrument.springingTrigger = 'physician-certification';
  d.authority.hotPowersInitialed = 'no';
  d.execution = { notaryArranged: 'yes', witnessCount: 1, witnessIsAgent: 'yes' };
  return d;
}

/** Execution risk: California with no notary and one witness. */
function riskCalifornia(): PowerOfAttorney {
  const d = base('Chen, Wei', 'CA', 'Lin Chen', ['hotGift']);
  d.execution = { notaryArranged: 'no', witnessCount: 1, witnessIsAgent: 'no' };
  d.instrument.statutoryNoticeIncluded = 'no';
  return d;
}

/** Incomplete: Ohio with no agent. */
function incompleteOhio(): PowerOfAttorney {
  const d = createDefaultInstrument();
  d.principal.principalName = 'Evans, Robert';
  d.principal.state = 'OH';
  return d;
}

/** Ready to execute: Pennsylvania with notary and two witnesses. */
function readyPennsylvania(): PowerOfAttorney {
  return base('Foster, Linda', 'PA', 'Gary Foster', ['hotGift']);
}

/** The sample instruments, keyed by stable id (used to seed the wizard). */
export const sampleInstruments: SampleInstrument[] = [
  {
    id: 'DPOA-2026-0001',
    principalName: 'Alvarez, Elena',
    agentName: 'Marco Alvarez',
    updatedDate: '2026-11-02',
    data: readyTexas()
  },
  {
    id: 'DPOA-2026-0002',
    principalName: 'Brooks, Harold',
    agentName: 'Diane Brooks',
    updatedDate: '2026-11-04',
    data: riskFlorida()
  },
  {
    id: 'DPOA-2026-0003',
    principalName: 'Chen, Wei',
    agentName: 'Lin Chen',
    updatedDate: '2026-11-06',
    data: riskCalifornia()
  },
  {
    id: 'DPOA-2026-0004',
    principalName: 'Evans, Robert',
    agentName: '',
    updatedDate: '2026-11-09',
    data: incompleteOhio()
  },
  {
    id: 'DPOA-2026-0005',
    principalName: 'Foster, Linda',
    agentName: 'Gary Foster',
    updatedDate: '2026-11-11',
    data: readyPennsylvania()
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleInstrumentRows: DashboardRow[] = sampleInstruments.map((s) => {
  const r = validateInstrument(s.data);
  return {
    id: s.id,
    state: s.data.principal.state,
    principalName: s.principalName,
    agentName: s.agentName,
    validityClass: r.validityClass,
    governingState: r.governingState,
    flagCount: r.flaggedIssues.length,
    updatedDate: s.updatedDate
  };
});
