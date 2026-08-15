<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import type { Sf36Response } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import ScaleItemField from './ScaleItemField.svelte';
	import {
		NOT_AT_ALL_TO_EXTREMELY_SCALE,
		BODILY_PAIN_SCALE,
		ALL_TO_NONE_OF_THE_TIME_SCALE,
		DEFINITELY_TRUE_TO_FALSE_SCALE
	} from '#lib/config/scales.js';

	const s = assessment.data.sf36;

	const vitalityMentalHealthItems: Array<{ field: keyof Sf36Response; letter: string; text: string }> = [
		{ field: 'feltFullOfLife', letter: 'a', text: 'Did you feel full of life?' },
		{ field: 'veryNervous', letter: 'b', text: 'Have you been a very nervous person?' },
		{
			field: 'soDownInDumps',
			letter: 'c',
			text: 'Have you felt so down in the dumps that nothing could cheer you up?'
		},
		{ field: 'feltCalmPeaceful', letter: 'd', text: 'Have you felt calm and peaceful?' },
		{ field: 'lotOfEnergy', letter: 'e', text: 'Did you have a lot of energy?' },
		{
			field: 'downheartedDepressed',
			letter: 'f',
			text: 'Have you felt downhearted and depressed?'
		},
		{ field: 'feltWornOut', letter: 'g', text: 'Did you feel worn out?' },
		{ field: 'beenHappy', letter: 'h', text: 'Have you been a happy person?' },
		{ field: 'feltTired', letter: 'i', text: 'Did you feel tired?' }
	];

	const generalHealthPerceptionItems: Array<{
		field: keyof Sf36Response;
		letter: string;
		text: string;
	}> = [
		{ field: 'getSickEasier', letter: 'a', text: 'I seem to get sick a little easier than other people' },
		{ field: 'asHealthyAsAnybody', letter: 'b', text: 'I am as healthy as anybody I know' },
		{ field: 'expectHealthWorse', letter: 'c', text: 'I expect my health to get worse' },
		{ field: 'healthExcellent', letter: 'd', text: 'My health is excellent' }
	];
</script>

<Fieldset legend="Step 5 of 9 — SF-36v2: pain, social, vitality, health perceptions (Q6-11)">
	<h3 class="mt-2 text-sm font-semibold text-base-content">Social activities (Q6)</h3>
	<ScaleItemField
		number="Q6"
		legend="During the past 4 weeks, to what extent has your physical health or emotional problems interfered with your normal social activities with family, friends, neighbors, or groups?"
		name="sf36-socialActivitiesInterference"
		options={NOT_AT_ALL_TO_EXTREMELY_SCALE}
		bind:value={s.socialActivitiesInterference}
	/>

	<h3 class="mt-4 text-sm font-semibold text-base-content">Bodily pain (Q7-8)</h3>
	<ScaleItemField
		number="Q7"
		legend="How much bodily pain have you had during the past 4 weeks?"
		name="sf36-bodilyPain"
		options={BODILY_PAIN_SCALE}
		bind:value={s.bodilyPain}
	/>
	<ScaleItemField
		number="Q8"
		legend="During the past 4 weeks, how much did pain interfere with your normal work (including both work outside the home and housework)?"
		name="sf36-painInterferenceWithWork"
		options={NOT_AT_ALL_TO_EXTREMELY_SCALE}
		bind:value={s.painInterferenceWithWork}
	/>

	<h3 class="mt-4 text-sm font-semibold text-base-content">
		Vitality and mental health, past 4 weeks (Q9a-i)
	</h3>
	<p class="hint">
		These questions are about how you feel and how things have been with you during the past 4
		weeks. For each question, please give the one answer that comes closest to the way you have
		been feeling. How much of the time during the past 4 weeks...
	</p>
	{#each vitalityMentalHealthItems as item (item.field)}
		<ScaleItemField
			number={`Q9${item.letter}`}
			legend={item.text}
			name={`sf36-${item.field}`}
			options={ALL_TO_NONE_OF_THE_TIME_SCALE}
			bind:value={s[item.field]}
		/>
	{/each}

	<h3 class="mt-4 text-sm font-semibold text-base-content">Social activities, time (Q10)</h3>
	<ScaleItemField
		number="Q10"
		legend="During the past 4 weeks, how much of the time has your physical health or emotional problems interfered with your social activities (like visiting friends, relatives, etc.)?"
		name="sf36-socialActivitiesInterferenceTime"
		options={ALL_TO_NONE_OF_THE_TIME_SCALE}
		bind:value={s.socialActivitiesInterferenceTime}
	/>

	<h3 class="mt-4 text-sm font-semibold text-base-content">General health perceptions (Q11a-d)</h3>
	<p class="hint">How TRUE or FALSE is each of the following statements for you?</p>
	{#each generalHealthPerceptionItems as item (item.field)}
		<ScaleItemField
			number={`Q11${item.letter}`}
			legend={item.text}
			name={`sf36-${item.field}`}
			options={DEFINITELY_TRUE_TO_FALSE_SCALE}
			bind:value={s[item.field]}
		/>
	{/each}
</Fieldset>
