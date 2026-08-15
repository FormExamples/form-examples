<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import type { MjoaResponse } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import ScaleItemField from './ScaleItemField.svelte';

	const m = assessment.data.mjoa;

	interface MjoaOption {
		value: number;
		label: string;
	}
	interface MjoaSubscale {
		field: keyof MjoaResponse;
		title: string;
		options: MjoaOption[];
	}

	const subscales: MjoaSubscale[] = [
		{
			field: 'motorArms',
			title: 'Motor, arms',
			options: [
				{ value: 0, label: 'Unable to feed oneself' },
				{ value: 1, label: 'Unable to use a knife and fork, able to eat with spoon' },
				{ value: 2, label: 'Able to use knife and fork with much difficulty' },
				{ value: 3, label: 'Able to use knife and fork with slight difficulty' },
				{ value: 4, label: 'No deficit' }
			]
		},
		{
			field: 'motorLegs',
			title: 'Motor, legs',
			options: [
				{ value: 0, label: 'Unable to walk' },
				{ value: 1, label: 'Can walk on flat floor with a walking aid' },
				{ value: 2, label: 'Can walk up or down stairs with a handrail' },
				{ value: 3, label: 'Lack of stability and smooth gait' },
				{ value: 4, label: 'No deficit' }
			]
		},
		{
			field: 'sensationArms',
			title: 'Sensation, arms',
			options: [
				{ value: 0, label: 'Severe sensory loss or pain' },
				{ value: 1, label: 'Mild sensory loss' },
				{ value: 2, label: 'No deficit' }
			]
		},
		{
			field: 'sensationLegs',
			title: 'Sensation, legs',
			options: [
				{ value: 0, label: 'Severe sensory loss or pain' },
				{ value: 1, label: 'Mild sensory loss' },
				{ value: 2, label: 'No deficit' }
			]
		},
		{
			field: 'sensationTrunk',
			title: 'Sensation, trunk',
			options: [
				{ value: 0, label: 'Severe sensory loss or pain' },
				{ value: 1, label: 'Mild sensory loss' },
				{ value: 2, label: 'No deficit' }
			]
		},
		{
			field: 'bladderFunction',
			title: 'Bladder function',
			options: [
				{ value: 0, label: 'Unable to void' },
				{
					value: 1,
					label: 'Marked difficulty with micturition (retention)'
				},
				{
					value: 2,
					label: 'Difficulty in micturition (frequency, hesitation)'
				},
				{ value: 3, label: 'No deficit' }
			]
		}
	];
</script>

<Fieldset legend="Step 7 of 9 — modified Japanese Orthopedic Association (mJOA)">
	<p class="hint">
		6 subscales, summed for a total 0-17 (higher = less dysfunction). Typically completed by the
		assessing clinician based on examination findings.
	</p>

	{#each subscales as subscale (subscale.field)}
		<ScaleItemField
			legend={subscale.title}
			name={`mjoa-${subscale.field}`}
			options={subscale.options}
			bind:value={m[subscale.field]}
		/>
	{/each}
</Fieldset>
