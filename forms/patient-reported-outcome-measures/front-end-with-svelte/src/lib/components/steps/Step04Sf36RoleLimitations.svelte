<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import type { Sf36Response } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import ScaleItemField from './ScaleItemField.svelte';
	import { ALL_TO_NONE_OF_THE_TIME_SCALE } from '#lib/config/scales.js';

	const s = assessment.data.sf36;

	const physicalItems: Array<{ field: keyof Sf36Response; letter: string; text: string }> = [
		{
			field: 'cutDownTimePhysical',
			letter: 'a',
			text: 'Cut down the amount of time you spent on work or other activities'
		},
		{
			field: 'accomplishedLessPhysical',
			letter: 'b',
			text: 'Accomplished less than you would like'
		},
		{
			field: 'limitedInKindPhysical',
			letter: 'c',
			text: 'Were limited in the kind of work or other activities'
		},
		{
			field: 'difficultyPerformingPhysical',
			letter: 'd',
			text: 'Had difficulty performing the work or other activities (for example, it took extra effort)'
		}
	];

	const emotionalItems: Array<{ field: keyof Sf36Response; letter: string; text: string }> = [
		{
			field: 'cutDownTimeEmotional',
			letter: 'a',
			text: 'Cut down the amount of time you spent on work or other activities'
		},
		{
			field: 'accomplishedLessEmotional',
			letter: 'b',
			text: 'Accomplished less than you would like'
		},
		{
			field: 'lessCarefulThanUsual',
			letter: 'c',
			text: "Didn't do work or other activities as carefully as usual"
		}
	];
</script>

<Fieldset legend="Step 4 of 9 — SF-36v2: role limitations (Q4-5)">
	<p class="hint">
		Q4. During the past 4 weeks, have you had any of the following problems with your work or
		other regular daily activities as a result of your physical health?
	</p>
	{#each physicalItems as item (item.field)}
		<ScaleItemField
			number={`Q4${item.letter}`}
			legend={item.text}
			name={`sf36-${item.field}`}
			options={ALL_TO_NONE_OF_THE_TIME_SCALE}
			bind:value={s[item.field]}
		/>
	{/each}

	<p class="hint">
		Q5. During the past 4 weeks, have you had any of the following problems with your work or
		other regular daily activities as a result of any emotional problems (such as feeling
		depressed or anxious)?
	</p>
	{#each emotionalItems as item (item.field)}
		<ScaleItemField
			number={`Q5${item.letter}`}
			legend={item.text}
			name={`sf36-${item.field}`}
			options={ALL_TO_NONE_OF_THE_TIME_SCALE}
			bind:value={s[item.field]}
		/>
	{/each}
</Fieldset>
