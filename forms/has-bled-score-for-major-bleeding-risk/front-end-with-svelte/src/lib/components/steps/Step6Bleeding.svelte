<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateHasBledGrade } from '$lib/engine/hasbled-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const b = assessment.data.bleeding;
	const point = $derived(calculateHasBledGrade(assessment.data).bleedingPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 9 — Bleeding history (B)">
	<p class="hint">
		Criterion B — scores 1 point for a bleeding history or predisposition: prior major bleeding, a
		bleeding diathesis, or anaemia.
	</p>

	<Field label="Bleeding history or predisposition (prior major bleed, diathesis, or anaemia)?">
		<RadioGroup label="Bleeding history or predisposition?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="bleeding-bleedingHistory"
						value={opt.value}
						bind:group={b.bleedingHistory}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion B point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
