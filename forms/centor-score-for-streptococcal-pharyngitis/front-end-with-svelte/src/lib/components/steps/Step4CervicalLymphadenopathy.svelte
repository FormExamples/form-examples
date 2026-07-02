<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCentorGrade } from '$lib/engine/centor-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const n = assessment.data.nodes;
	const point = $derived(calculateCentorGrade(assessment.data).tenderNodesPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 4 of 8 — Cervical lymphadenopathy">
	<p class="hint">
		Criterion 2 — scores 1 point when there is tender, swollen anterior cervical lymphadenopathy.
	</p>

	<Field label="Tender anterior cervical lymph nodes?">
		<RadioGroup label="Tender anterior cervical lymph nodes?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="nodes-tenderAnteriorCervicalNodes"
						value={opt.value}
						bind:group={n.tenderAnteriorCervicalNodes}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 2 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
