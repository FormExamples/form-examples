<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.cardiovascularRisk;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cardiovascular Risk">
	<p class="hint">Factors affecting cardiovascular risk and contraceptive eligibility.</p>

	<Field label="BMI (kg/m²)" inputId="bmi">
		<NumberInput id="bmi" label="BMI" min={10} max={80} step={0.1} bind:value={c.bmi} />
	</Field>

	<Field label="Smoking status" inputId="smoking">
		<Select id="smoking" label="Smoking status" bind:value={c.smoking}>
			<option value="">-- Select --</option>
			<option value="never">Never smoked</option>
			<option value="former">Former smoker</option>
			<option value="current-light">Current smoker (&lt; 15 per day)</option>
			<option value="current-heavy">Current smoker (≥ 15 per day)</option>
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="Blood pressure (systolic mmHg)" inputId="bpSystolic">
			<NumberInput id="bpSystolic" label="Blood pressure (systolic)" min={60} max={250} bind:value={c.bloodPressureSystolic} />
		</Field>
		<Field label="Blood pressure (diastolic mmHg)" inputId="bpDiastolic">
			<NumberInput id="bpDiastolic" label="Blood pressure (diastolic)" min={30} max={150} bind:value={c.bloodPressureDiastolic} />
		</Field>
	</div>

	<Field label="Family history of cardiovascular disease (before age 50)?">
		<RadioGroup label="Family history of cardiovascular disease (before age 50)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="familyHistoryCVD" value={opt.value} bind:group={c.familyHistoryCVD} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have lipid disorders (high cholesterol/triglycerides)?">
		<RadioGroup label="Do you have lipid disorders (high cholesterol/triglycerides)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="lipidDisorders" value={opt.value} bind:group={c.lipidDisorders} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
