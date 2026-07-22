// Shared SF-36v2 response-scale option labels (spec/index.md §1). Each
// scale is a fixed, small set of ordinal options presented as a radio
// group per item. Values are the raw 1-based (or 1-6) integers the
// scoring engine expects — see ../engine/sf36-rules.ts for the
// recode/direction table each field uses.

export interface ScaleOption {
	value: number;
	label: string;
}

/** Q1 generalHealth: 1 Excellent ... 5 Poor. */
export const GENERAL_HEALTH_SCALE: ScaleOption[] = [
	{ value: 1, label: 'Excellent' },
	{ value: 2, label: 'Very good' },
	{ value: 3, label: 'Good' },
	{ value: 4, label: 'Fair' },
	{ value: 5, label: 'Poor' }
];

/** Q2 healthChangeVsYearAgo. */
export const HEALTH_CHANGE_SCALE: ScaleOption[] = [
	{ value: 1, label: 'Much better now than one year ago' },
	{ value: 2, label: 'Somewhat better now than one year ago' },
	{ value: 3, label: 'About the same as one year ago' },
	{ value: 4, label: 'Somewhat worse now than one year ago' },
	{ value: 5, label: 'Much worse now than one year ago' }
];

/** Q3a-j activity-limitation items. */
export const ACTIVITY_LIMITATION_SCALE: ScaleOption[] = [
	{ value: 1, label: 'Yes, limited a lot' },
	{ value: 2, label: 'Yes, limited a little' },
	{ value: 3, label: 'No, not limited at all' }
];

/** Q4a-d and Q5a-c role-limitation items. */
export const ALL_TO_NONE_OF_THE_TIME_SCALE: ScaleOption[] = [
	{ value: 1, label: 'All of the time' },
	{ value: 2, label: 'Most of the time' },
	{ value: 3, label: 'Some of the time' },
	{ value: 4, label: 'A little of the time' },
	{ value: 5, label: 'None of the time' }
];

/** Q6, Q8 interference items. */
export const NOT_AT_ALL_TO_EXTREMELY_SCALE: ScaleOption[] = [
	{ value: 1, label: 'Not at all' },
	{ value: 2, label: 'Slightly' },
	{ value: 3, label: 'Moderately' },
	{ value: 4, label: 'Quite a bit' },
	{ value: 5, label: 'Extremely' }
];

/** Q7 bodilyPain: 1 None ... 6 Very severe. */
export const BODILY_PAIN_SCALE: ScaleOption[] = [
	{ value: 1, label: 'None' },
	{ value: 2, label: 'Very mild' },
	{ value: 3, label: 'Mild' },
	{ value: 4, label: 'Moderate' },
	{ value: 5, label: 'Severe' },
	{ value: 6, label: 'Very severe' }
];

/** Q11a-d items. */
export const DEFINITELY_TRUE_TO_FALSE_SCALE: ScaleOption[] = [
	{ value: 1, label: 'Definitely true' },
	{ value: 2, label: 'Mostly true' },
	{ value: 3, label: "Don't know" },
	{ value: 4, label: 'Mostly false' },
	{ value: 5, label: 'Definitely false' }
];
