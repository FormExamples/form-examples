import type {
	AcuteChange,
	AcuteChangeSource,
	Alertness,
	Amt4,
	AttentionMonths,
	InterpretationBand,
	Priority,
	Setting
} from './types';

/** Interpretation-band label for display. */
export function interpretationBandLabel(band: InterpretationBand): string {
	switch (band) {
		case 'unlikely':
			return 'Delirium unlikely (score 0)';
		case 'possibleCognitiveImpairment':
			return 'Possible cognitive impairment (score 1-3)';
		case 'possibleDelirium':
			return 'Possible delirium (score 4 or more)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the interpretation-band badge/banner.
 * Unlikely → success; possible cognitive impairment → warning; possible
 * delirium → error.
 */
export function interpretationBandColor(band: InterpretationBand): string {
	switch (band) {
		case 'unlikely':
			return 'bg-success text-success-content border-success';
		case 'possibleCognitiveImpairment':
			return 'bg-warning text-warning-content border-warning';
		case 'possibleDelirium':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for an item score pill (0 = neutral, > 0 = warning). */
export function pointColor(point: number): string {
	return point > 0
		? 'bg-warning text-warning-content border-warning'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority label. */
export function priorityLabel(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'HIGH';
		case 'medium':
			return 'MEDIUM';
		case 'low':
			return 'LOW';
		default:
			return '';
	}
}

/** Care-setting label. */
export function settingLabel(setting: Setting): string {
	switch (setting) {
		case 'acute':
			return 'Acute medical admission';
		case 'ed':
			return 'Emergency department';
		case 'periop':
			return 'Peri-operative / post-operative';
		case 'careHome':
			return 'Care home';
		case 'community':
			return 'Community';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Item 1 alertness label. */
export function alertnessLabel(value: Alertness): string {
	switch (value) {
		case 'normal':
			return 'Normal — fully alert, not agitated';
		case 'mildTransient':
			return 'Mild sleepiness under 10 seconds after waking, then normal';
		case 'abnormal':
			return 'Clearly abnormal — markedly drowsy or agitated / hyperactive';
		default:
			return '';
	}
}

/** Item 2 AMT4 mistake-band label. */
export function amt4Label(value: Amt4): string {
	switch (value) {
		case 'noMistakes':
			return 'No mistakes';
		case 'oneMistake':
			return '1 mistake';
		case 'twoOrMoreOrUntestable':
			return '2 or more mistakes, or untestable';
		default:
			return '';
	}
}

/** Item 3 attention (months backwards) label. */
export function attentionLabel(value: AttentionMonths): string {
	switch (value) {
		case 'sevenOrMore':
			return 'Achieves 7 or more months correctly';
		case 'startsButUnderSevenOrRefuses':
			return 'Starts but scores under 7 months, or refuses to start';
		case 'untestable':
			return 'Untestable — cannot start (unwell, drowsy, or inattentive)';
		default:
			return '';
	}
}

/** Item 4 acute-change label. */
export function acuteChangeLabel(value: AcuteChange): string {
	switch (value) {
		case 'no':
			return 'No';
		case 'yes':
			return 'Yes';
		default:
			return '';
	}
}

/** Item 4 acute-change information-source label. */
export function acuteChangeSourceLabel(value: AcuteChangeSource): string {
	switch (value) {
		case 'patient':
			return 'Patient';
		case 'collateral':
			return 'Collateral history';
		case 'records':
			return 'Records';
		case 'none':
			return 'None available';
		default:
			return '';
	}
}
