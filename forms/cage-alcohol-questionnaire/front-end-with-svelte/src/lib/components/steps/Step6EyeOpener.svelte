<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCageGrade } from '$lib/engine/cage-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.criteria;
	const point = $derived(calculateCageGrade(assessment.data).eyeOpenerPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 7 — Eye-opener (E)">
	<p class="hint">
		Criterion E — scores 1 point for a "yes". Morning drinking to steady nerves or relieve a
		hangover is a marker of physical dependence and warrants attention even when the total is
		below 2.
	</p>

	<Field
		label="Have you ever had a drink first thing in the morning to steady your nerves or get rid of a hangover (an eye-opener)?"
	>
		<RadioGroup
			label="Have you ever had a drink first thing in the morning to steady your nerves or get rid of a hangover (an eye-opener)?"
		>
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="criteria-eyeOpener"
						value={opt.value}
						bind:group={c.eyeOpener}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion E point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
