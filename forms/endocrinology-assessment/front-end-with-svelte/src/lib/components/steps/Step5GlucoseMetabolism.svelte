<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const g = assessment.data.glucoseMetabolism;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Glucose Metabolism">
	<p class="hint">HbA1c &lt;42 normal, 42–47 prediabetes, ≥48 diabetes (mmol/mol) · Fasting glucose ≥7.0 diabetes (mmol/L).</p>

	<div class="field-grid field-grid-3">
		<Field label="HbA1c (mmol/mol)" inputId="hba1c">
			<NumberInput id="hba1c" label="HbA1c" min={0} bind:value={g.hba1c} />
		</Field>
		<Field label="Fasting glucose (mmol/L)" inputId="fastingGlucose">
			<NumberInput id="fastingGlucose" label="Fasting glucose" step="0.1" min={0} bind:value={g.fastingGlucose} />
		</Field>
		<Field label="Random glucose (mmol/L)" inputId="randomGlucose">
			<NumberInput id="randomGlucose" label="Random glucose" step="0.1" min={0} bind:value={g.randomGlucose} />
		</Field>
	</div>

	<Field label="Known diabetes">
		<RadioGroup label="Known diabetes">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="knownDiabetes" value={opt.value} bind:group={g.knownDiabetes} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if g.knownDiabetes === 'yes'}
		<Field label="Diabetes type" inputId="diabetesType">
			<Select id="diabetesType" label="Diabetes type" bind:value={g.diabetesType}>
				<option value="">-- Select --</option>
				<option value="type1">Type 1</option>
				<option value="type2">Type 2</option>
				<option value="other">Other / secondary</option>
			</Select>
		</Field>
	{/if}

	<Field label="History of hypoglycaemic episodes">
		<RadioGroup label="History of hypoglycaemic episodes">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="hypoglycaemiaEpisodes" value={opt.value} bind:group={g.hypoglycaemiaEpisodes} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Glucose notes" inputId="glucoseNotes">
		<TextAreaInput id="glucoseNotes" label="Glucose notes" rows={3} bind:value={g.glucoseNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
