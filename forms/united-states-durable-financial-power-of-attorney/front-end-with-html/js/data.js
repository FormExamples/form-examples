// Sample instrument data for the readiness dashboard.
//
// Mirrors the SvelteKit dashboard's sample data so both implementations show
// identical demo content when the backend is offline. The rows span all three
// validity classes and several states. Names are fictional.

/** @type {import('./dashboard-types.js').InstrumentRow[]} */
const sampleInstruments = [
  { id: '1', principalName: 'Alvarez, Elena', state: 'TX', validityClass: 'ready-to-execute', governingState: 'Texas', executionRiskIndicated: false, agentName: 'Marco Alvarez', updatedAt: '2026-11-02' },
  { id: '2', principalName: 'Brooks, Harold', state: 'FL', validityClass: 'execution-risk', governingState: 'Florida', executionRiskIndicated: true, agentName: 'Diane Brooks', updatedAt: '2026-11-04' },
  { id: '3', principalName: 'Chen, Wei', state: 'CA', validityClass: 'ready-to-execute', governingState: 'California', executionRiskIndicated: false, agentName: 'Lin Chen', updatedAt: '2026-11-06' },
  { id: '4', principalName: 'Dunn, Patricia', state: 'NY', validityClass: 'execution-risk', governingState: 'New York', executionRiskIndicated: true, agentName: 'Thomas Dunn', updatedAt: '2026-11-08' },
  { id: '5', principalName: 'Evans, Robert', state: 'OH', validityClass: 'incomplete', governingState: 'Ohio', executionRiskIndicated: false, agentName: '', updatedAt: '2026-11-09' },
  { id: '6', principalName: 'Foster, Linda', state: 'PA', validityClass: 'ready-to-execute', governingState: 'Pennsylvania', executionRiskIndicated: false, agentName: 'Gary Foster', updatedAt: '2026-11-11' },
  { id: '7', principalName: 'Garcia, Samuel', state: 'WA', validityClass: 'ready-to-execute', governingState: 'Washington', executionRiskIndicated: false, agentName: 'Rosa Garcia', updatedAt: '2026-11-12' },
  { id: '8', principalName: 'Hughes, Marian', state: 'IL', validityClass: 'execution-risk', governingState: 'Illinois', executionRiskIndicated: true, agentName: 'Peter Hughes', updatedAt: '2026-11-14' },
  { id: '9', principalName: 'Ito, Kenji', state: 'OR', validityClass: 'incomplete', governingState: 'Uniform default (verify)', executionRiskIndicated: false, agentName: 'Yuki Ito', updatedAt: '2026-11-15' }
];

export { sampleInstruments };
