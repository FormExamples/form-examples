// Combines the 4 independent instrument scores into one report object.
// There is no cross-instrument composite score - each instrument is
// scored on its own terms; this just aggregates the 4 results for the
// summary step / report view.
//
// Direct TypeScript port of ../../../front-end-with-html/js/composite.js.

import { computeSf36 } from './sf36-rules';
import { computeNdi } from './ndi-rules';
import { computeMjoa } from './mjoa-rules';
import { computeEq5d } from './eq5d-rules';
import type { AllScoresResult, PatientReportedOutcomeMeasures } from './types';

export function computeAllScores(data: PatientReportedOutcomeMeasures): AllScoresResult {
	return {
		sf36: computeSf36(data.sf36),
		ndi: computeNdi(data.ndi),
		mjoa: computeMjoa(data.mjoa),
		eq5d: computeEq5d(data.eq5d)
	};
}
