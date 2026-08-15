<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const g = assessment.data.precondition;
	const hypoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'na', label: 'Not applicable' }
	];

	const glucoseStatus = $derived(
		g.bloodGlucose === null
			? 'Blood glucose not yet recorded.'
			: g.bloodGlucose < 3.5
				? `${g.bloodGlucose} mmol/L — hypoglycaemia mimic (correct and reassess before scoring)`
				: `${g.bloodGlucose} mmol/L — no hypoglycaemia mimic`
	);
	const glucoseLow = $derived(g.bloodGlucose !== null && g.bloodGlucose < 3.5);
</script>

<Fieldset legend="Step 3 of 6 — Blood glucose precondition">
	<p class="hint">
		Measure blood glucose first. Hypoglycaemia (&lt; 3.5 mmol/L) is a treatable stroke mimic —
		correct it before interpreting the ROSIER score.
	</p>

	<Field
		label="Measured blood glucose (mmol/L)"
		description="A value below 3.5 mmol/L flags the hypoglycaemia mimic; the ROSIER score is not valid while the patient is hypoglycaemic."
		inputId="precondition-bloodGlucose"
	>
		<NumberInput
			id="precondition-bloodGlucose"
			label="Measured blood glucose"
			min={0}
			max={40}
			step={0.1}
			bind:value={g.bloodGlucose}
		/>
	</Field>

	<Field label="Was hypoglycaemia corrected before applying the score?">
		<RadioGroup label="Was hypoglycaemia corrected before applying the score?">
			{#each hypoOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="precondition-hypoglycaemiaCorrected"
						value={opt.value}
						bind:group={g.hypoglycaemiaCorrected}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Precondition status">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {glucoseLow
				? 'bg-error text-error-content border-error'
				: 'bg-base-300 text-base-content border-base-300'}"
		>
			{glucoseStatus}
		</span>
	</Field>
</Fieldset>
