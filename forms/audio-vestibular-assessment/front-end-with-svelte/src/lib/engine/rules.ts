// Audio-Vestibular Assessment scoring rules — classification primitives.
//
// Two independent instruments are computed:
//
//   1) WHO pure-tone audiometry hearing-loss grade, derived from the
//      better-ear four-frequency average (0.5 + 1 + 2 + 4 kHz) / 4.
//      Cutoffs (better-ear PTA, dB HL):
//        <  20 -> normal
//        20-34 -> mild
//        35-49 -> moderate
//        50-64 -> moderately-severe
//        65-79 -> severe
//        >=80  -> profound
//
//   2) Dizziness Handicap Inventory (DHI), 25 items scored
//      Yes = 4, Sometimes = 2, No = 0; total range 0-100.
//      Cutoffs (DHI total):
//        0-16  -> no handicap
//        18-36 -> mild
//        38-52 -> moderate
//        >=54  -> severe

import type { DhiAnswer, DhiHandicapLevel, DhiItem, EarThresholds, HearingLossGrade } from './types';

/**
 * Canonical DHI item ordering. 25 items: 7 functional (F), 9 emotional (E),
 * 9 physical (P). Numbering matches the Jacobson & Newman 1990 instrument.
 */
export const DHI_ITEMS: DhiItem[] = [
	{ num: 1, subscale: 'P', text: 'Does looking up increase your problem?' },
	{ num: 2, subscale: 'E', text: 'Because of your problem, do you feel frustrated?' },
	{ num: 3, subscale: 'F', text: 'Because of your problem, do you restrict your travel for business or recreation?' },
	{ num: 4, subscale: 'P', text: 'Does walking down the aisle of a supermarket increase your problem?' },
	{ num: 5, subscale: 'F', text: 'Because of your problem, do you have difficulty getting into or out of bed?' },
	{ num: 6, subscale: 'F', text: 'Does your problem significantly restrict your participation in social activities such as going out to dinner, going to the movies, dancing, or to parties?' },
	{ num: 7, subscale: 'F', text: 'Because of your problem, do you have difficulty reading?' },
	{ num: 8, subscale: 'P', text: 'Does performing more ambitious activities like sports, dancing, household chores such as sweeping or putting dishes away increase your problem?' },
	{ num: 9, subscale: 'E', text: 'Because of your problem, are you afraid to leave your home without having someone accompany you?' },
	{ num: 10, subscale: 'E', text: 'Because of your problem, have you been embarrassed in front of others?' },
	{ num: 11, subscale: 'P', text: 'Do quick movements of your head increase your problem?' },
	{ num: 12, subscale: 'F', text: 'Because of your problem, do you avoid heights?' },
	{ num: 13, subscale: 'P', text: 'Does turning over in bed increase your problem?' },
	{ num: 14, subscale: 'F', text: 'Because of your problem, is it difficult for you to do strenuous housework or yardwork?' },
	{ num: 15, subscale: 'E', text: 'Because of your problem, are you afraid people may think you are intoxicated?' },
	{ num: 16, subscale: 'F', text: 'Because of your problem, is it difficult for you to go for a walk by yourself?' },
	{ num: 17, subscale: 'P', text: 'Does walking down a sidewalk increase your problem?' },
	{ num: 18, subscale: 'E', text: 'Because of your problem, is it difficult for you to concentrate?' },
	{ num: 19, subscale: 'F', text: 'Because of your problem, is it difficult for you to walk around your house in the dark?' },
	{ num: 20, subscale: 'E', text: 'Because of your problem, are you afraid to stay home alone?' },
	{ num: 21, subscale: 'E', text: 'Because of your problem, do you feel handicapped?' },
	{ num: 22, subscale: 'E', text: 'Has the problem placed stress on your relationships with family or friends?' },
	{ num: 23, subscale: 'E', text: 'Because of your problem, are you depressed?' },
	{ num: 24, subscale: 'F', text: 'Does your problem interfere with your job or household responsibilities?' },
	{ num: 25, subscale: 'P', text: 'Does bending over increase your problem?' }
];

/** Calculate a four-frequency PTA from {hz500, hz1000, hz2000, hz4000}. */
export function calculatePtaFromThresholds(thr: EarThresholds | null | undefined): number | null {
	if (!thr) return null;
	const vs = [thr.hz500, thr.hz1000, thr.hz2000, thr.hz4000].filter(
		(v): v is number => typeof v === 'number' && !Number.isNaN(v)
	);
	if (vs.length === 0) return null;
	const sum = vs.reduce((a, b) => a + b, 0);
	return Math.round((sum / vs.length) * 10) / 10;
}

/** Classify a numeric better-ear PTA into a WHO hearing-loss grade. */
export function classifyHearingLossGrade(pta: number | null | undefined): HearingLossGrade {
	if (pta === null || pta === undefined || Number.isNaN(pta)) return 'unknown';
	if (pta < 20) return 'normal';
	if (pta < 35) return 'mild';
	if (pta < 50) return 'moderate';
	if (pta < 65) return 'moderately-severe';
	if (pta < 80) return 'severe';
	return 'profound';
}

/** Score one DHI answer ('yes' = 4, 'sometimes' = 2, 'no'/'' = 0). */
export function dhiAnswerScore(answer: DhiAnswer): number {
	if (answer === 'yes') return 4;
	if (answer === 'sometimes') return 2;
	return 0;
}

/** Classify a numeric DHI total (0-100). */
export function classifyDhiHandicap(total: number): DhiHandicapLevel {
	if (total <= 16) return 'no-handicap';
	if (total <= 36) return 'mild';
	if (total <= 52) return 'moderate';
	return 'severe';
}
