import type { AssessmentData, BLSRule, TriState } from './types';
import { compressionRateInRange, compressionDepthInRange } from './utils';

/**
 * AHA BLS Skills Verification checklist rules (declarative).
 *
 * Each rule maps a single observed skill to a tri-state value:
 *   'yes' = demonstrated correctly (passes the rule)
 *   'no'  = not yet demonstrated (deficiency)
 *   'na'  = not assessed in this session (excluded from grading)
 *   ''    = examiner has not yet recorded an answer (excluded)
 *
 * Critical actions (per AHA): any 'no' on a rule with critical=true forces an
 * overall Fail. Non-critical rules contribute to the deficiency count
 * (>2 deficiencies → Fail).
 */

/** Read a tri-state field, normalising missing/unknown values. */
function read<S extends keyof AssessmentData>(
	d: AssessmentData,
	section: S,
	field: keyof AssessmentData[S] & string
): TriState {
	const v = (d[section] as unknown as Record<string, unknown>)[field];
	if (v === 'yes' || v === 'no' || v === 'na') return v;
	return '';
}

export const blsRules: BLSRule[] = [
	// --- Step 2: Scene Safety & Initial Assessment -------------------------
	{
		id: 'BLS-SS-SAFE',
		step: 2,
		category: 'Scene Safety',
		label: 'Confirms the scene is safe before approaching the casualty.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'sceneSafety', 'sceneSafe')
	},
	{
		id: 'BLS-SS-PPE',
		step: 2,
		category: 'Scene Safety',
		label: 'Applies appropriate personal protective equipment (PPE).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'sceneSafety', 'ppeApplied')
	},
	{
		id: 'BLS-SS-HAZARDS',
		step: 2,
		category: 'Scene Safety',
		label: 'Identifies and mitigates environmental hazards.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'sceneSafety', 'hazardsIdentified')
	},
	{
		id: 'BLS-SS-BYSTANDERS',
		step: 2,
		category: 'Scene Safety',
		label: 'Manages bystanders so they do not impede care.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'sceneSafety', 'bystandersControlled')
	},

	// --- Step 3: Responsiveness & Breathing Check --------------------------
	{
		id: 'BLS-RB-TAP',
		step: 3,
		category: 'Responsiveness',
		label: 'Taps shoulders and shouts "Are you OK?" to assess responsiveness.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'responsivenessBreathing', 'tappedAndShouted')
	},
	{
		id: 'BLS-RB-BREATH',
		step: 3,
		category: 'Breathing Check',
		label: 'Checks for absent or abnormal breathing (look at chest).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'responsivenessBreathing', 'checkedBreathing')
	},
	{
		id: 'BLS-RB-PULSE',
		step: 3,
		category: 'Breathing Check',
		label: 'Checks carotid pulse simultaneously with breathing check.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'responsivenessBreathing', 'checkedPulseSimultaneously')
	},
	{
		id: 'BLS-RB-TIME',
		step: 3,
		category: 'Breathing Check',
		label: 'Completes pulse and breathing check in 10 seconds or less.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'responsivenessBreathing', 'timeWithinTenSeconds')
	},

	// --- Step 4: Activate Emergency Response --------------------------------
	{
		id: 'BLS-ER-CALL',
		step: 4,
		category: 'Emergency Response',
		label: 'Activates emergency response (calls 999 / 2222 in hospital).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'activateEmergencyResponse', 'calledEmergencyNumber')
	},
	{
		id: 'BLS-ER-INFO',
		step: 4,
		category: 'Emergency Response',
		label: 'States location and casualty condition clearly.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'activateEmergencyResponse', 'statedLocationAndCondition')
	},
	{
		id: 'BLS-ER-AED',
		step: 4,
		category: 'Emergency Response',
		label: 'Designates a specific bystander to retrieve the AED.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'activateEmergencyResponse', 'designatedAedRetriever')
	},
	{
		id: 'BLS-ER-SPEAKER',
		step: 4,
		category: 'Emergency Response',
		label: 'Uses speakerphone to keep both hands free for care.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'activateEmergencyResponse', 'usedSpeakerphone')
	},

	// --- Step 5: Chest Compressions ----------------------------------------
	{
		id: 'BLS-CC-HAND',
		step: 5,
		category: 'Chest Compressions',
		label: 'Correct hand position (centre of chest, lower half of sternum).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'chestCompressions', 'correctHandPosition')
	},
	{
		id: 'BLS-CC-RECOIL',
		step: 5,
		category: 'Chest Compressions',
		label: 'Allows full chest recoil between compressions.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'chestCompressions', 'fullChestRecoil')
	},
	{
		id: 'BLS-CC-INTERRUPT',
		step: 5,
		category: 'Chest Compressions',
		label: 'Minimises interruptions in chest compressions (<10 s).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'chestCompressions', 'minimisedInterruptions')
	},
	{
		id: 'BLS-CC-RATE',
		step: 5,
		category: 'Chest Compressions',
		label: 'Compressions delivered at AHA rate of 100-120 per minute.',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => {
			// If the examiner has explicitly recorded the tri-state field, use it.
			const explicit = read(d, 'chestCompressions', 'compressionsAtCorrectRate');
			if (explicit !== '') return explicit;
			// Else derive from the numeric measurement.
			const rate = d.chestCompressions.compressionRate;
			if (rate === null || rate === undefined) return '';
			return compressionRateInRange(rate) ? 'yes' : 'no';
		}
	},
	{
		id: 'BLS-CC-DEPTH',
		step: 5,
		category: 'Chest Compressions',
		label: 'Compressions delivered to AHA depth of 5-6 cm for an adult.',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => {
			const explicit = read(d, 'chestCompressions', 'compressionsAtCorrectDepth');
			if (explicit !== '') return explicit;
			const depth = d.chestCompressions.compressionDepth;
			if (depth === null || depth === undefined) return '';
			return compressionDepthInRange(depth) ? 'yes' : 'no';
		}
	},

	// --- Step 6: Airway & Rescue Breaths -----------------------------------
	{
		id: 'BLS-AB-AIRWAY',
		step: 6,
		category: 'Airway & Breaths',
		label: 'Opens airway with head tilt-chin lift (or jaw thrust if trauma).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'airwayRescueBreaths', 'headTiltChinLift')
	},
	{
		id: 'BLS-AB-SEAL',
		step: 6,
		category: 'Airway & Breaths',
		label: 'Achieves an effective seal on mask or pocket-mask device.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'airwayRescueBreaths', 'effectiveSeal')
	},
	{
		id: 'BLS-AB-CHEST-RISE',
		step: 6,
		category: 'Airway & Breaths',
		label: 'Each ventilation produces visible chest rise (effective breath).',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'airwayRescueBreaths', 'visibleChestRise')
	},
	{
		id: 'BLS-AB-DURATION',
		step: 6,
		category: 'Airway & Breaths',
		label: 'Delivers each breath over approximately 1 second.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'airwayRescueBreaths', 'oneSecondPerBreath')
	},
	{
		id: 'BLS-AB-RATIO',
		step: 6,
		category: 'Airway & Breaths',
		label: 'Maintains a 30:2 compression-to-ventilation ratio.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'airwayRescueBreaths', 'ratio30to2')
	},
	{
		id: 'BLS-AB-NOEXCESS',
		step: 6,
		category: 'Airway & Breaths',
		label: 'Avoids excessive ventilation (volume and rate).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'airwayRescueBreaths', 'avoidedExcessiveVentilation')
	},

	// --- Step 7: AED Use & Shock Delivery -----------------------------------
	{
		id: 'BLS-AED-POWER',
		step: 7,
		category: 'AED Use',
		label: 'Powers on the AED as soon as it is available.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'aedShockDelivery', 'poweredOnPromptly')
	},
	{
		id: 'BLS-AED-PADS',
		step: 7,
		category: 'AED Use',
		label: 'Places pads in correct anterolateral position on bare chest.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'aedShockDelivery', 'correctPadPlacement')
	},
	{
		id: 'BLS-AED-CLEAR-ANALYSIS',
		step: 7,
		category: 'AED Use',
		label: 'Ensures everyone is clear during rhythm analysis.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'aedShockDelivery', 'clearedDuringAnalysis')
	},
	{
		id: 'BLS-AED-SAFE-SHOCK',
		step: 7,
		category: 'AED Use',
		label: 'Delivers shock with verbal "I’m clear, you’re clear, everyone clear" and no unsafe contact.',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'aedShockDelivery', 'deliveredShockSafely')
	},
	{
		id: 'BLS-AED-RESUME',
		step: 7,
		category: 'AED Use',
		label: 'Resumes chest compressions immediately after shock.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'aedShockDelivery', 'resumedCompressionsImmediately')
	},

	// --- Step 8: Team Dynamics, Handoff & Feedback -------------------------
	{
		id: 'BLS-TD-COMM',
		step: 8,
		category: 'Team Dynamics',
		label: 'Uses clear, calm communication with the team.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'teamDynamicsHandoff', 'clearCommunication')
	},
	{
		id: 'BLS-TD-CLOSED-LOOP',
		step: 8,
		category: 'Team Dynamics',
		label: 'Uses closed-loop communication for orders and tasks.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'teamDynamicsHandoff', 'closedLoopOrders')
	},
	{
		id: 'BLS-TD-HANDOFF',
		step: 8,
		category: 'Team Dynamics',
		label: 'Provides a structured handoff to incoming providers (SBAR).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'teamDynamicsHandoff', 'appropriateHandoff')
	},
	{
		id: 'BLS-TD-DEBRIEF',
		step: 8,
		category: 'Team Dynamics',
		label: 'Participates constructively in the post-event debrief.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'teamDynamicsHandoff', 'debriefParticipated')
	}
];
