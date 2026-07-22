// Combines the 4 independent instrument scores into one report object.
// There is no cross-instrument composite score - each instrument is
// scored on its own terms; this just aggregates the 4 results for the
// summary step / report view.

import { computeSf36 } from './sf36-rules.js';
import { computeNdi } from './ndi-rules.js';
import { computeMjoa } from './mjoa-rules.js';
import { computeEq5d } from './eq5d-rules.js';

/**
 * @param {ReturnType<typeof import('./types.js').emptyAssessment>} data
 */
function computeAllScores(data) {
  return {
    sf36: computeSf36(data.sf36),
    ndi: computeNdi(data.ndi),
    mjoa: computeMjoa(data.mjoa),
    eq5d: computeEq5d(data.eq5d)
  };
}

export { computeAllScores };
