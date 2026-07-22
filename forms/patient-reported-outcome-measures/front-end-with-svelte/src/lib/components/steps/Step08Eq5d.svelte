<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { Eq5dResponse } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import ScaleItemField from './ScaleItemField.svelte';

	const e = assessment.data.eq5d;

	interface Eq5dOption {
		value: number;
		label: string;
	}
	interface Eq5dDimension {
		field: keyof Eq5dResponse;
		title: string;
		options: Eq5dOption[];
	}

	const dimensions: Eq5dDimension[] = [
		{
			field: 'mobility',
			title: 'Mobility',
			options: [
				{ value: 1, label: 'I have no problems in walking about' },
				{ value: 2, label: 'I have some problems in walking about' },
				{ value: 3, label: 'I am confined to bed' }
			]
		},
		{
			field: 'selfCare',
			title: 'Self-Care',
			options: [
				{ value: 1, label: 'I have no problems with self-care' },
				{ value: 2, label: 'I have some problems washing or dressing myself' },
				{ value: 3, label: 'I am unable to wash or dress myself' }
			]
		},
		{
			field: 'usualActivities',
			title: 'Usual Activities (work, study, housework, family, or leisure)',
			options: [
				{ value: 1, label: 'I have no problems with performing my usual activities' },
				{ value: 2, label: 'I have some problems with performing my usual activities' },
				{ value: 3, label: 'I am unable to perform my usual activities' }
			]
		},
		{
			field: 'painDiscomfort',
			title: 'Pain/Discomfort',
			options: [
				{ value: 1, label: 'I have no pain or discomfort' },
				{ value: 2, label: 'I have moderate pain or discomfort' },
				{ value: 3, label: 'I have extreme pain or discomfort' }
			]
		},
		{
			field: 'anxietyDepression',
			title: 'Anxiety/Depression',
			options: [
				{ value: 1, label: 'I am not anxious or depressed' },
				{ value: 2, label: 'I am moderately anxious or depressed' },
				{ value: 3, label: 'I am extremely anxious or depressed' }
			]
		}
	];
</script>

<Fieldset legend="Step 8 of 9 — EQ-5D-3L">
	<p class="hint">
		5 dimensions, each at one of 3 levels, plus a 0-100 visual analogue scale (VAS) of current
		health. The EuroQol Group, 1990.
	</p>

	{#each dimensions as dimension (dimension.field)}
		<ScaleItemField
			legend={dimension.title}
			name={`eq5d-${dimension.field}`}
			options={dimension.options}
			bind:value={e[dimension.field]}
		/>
	{/each}

	<Field
		label="EQ VAS — your own health state today"
		description="0 = the worst health you can imagine, 100 = the best health you can imagine"
		inputId="eq5d-vasScore"
	>
		<NumberInput
			id="eq5d-vasScore"
			label="EQ VAS — your own health state today"
			min={0}
			max={100}
			bind:value={e.vasScore}
		/>
	</Field>
</Fieldset>
