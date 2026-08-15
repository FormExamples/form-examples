<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.diabetesHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Diabetes History">
	<p class="hint">Record the patient's diabetes diagnosis and history.</p>

	<div class="field-grid">
		<Field label="Diabetes Type" inputId="diabetesType">
			<Select id="diabetesType" label="Diabetes Type" bind:value={d.diabetesType}>
				<option value="">-- Select --</option>
				<option value="type1">Type 1</option>
				<option value="type2">Type 2</option>
				<option value="gestational">Gestational</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Age at Diagnosis" inputId="ageAtDiagnosis">
			<NumberInput id="ageAtDiagnosis" label="Age at Diagnosis" min={0} max={120} placeholder="e.g. 45" bind:value={d.ageAtDiagnosis} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Years Since Diagnosis" inputId="yearsDuration">
			<NumberInput id="yearsDuration" label="Years Since Diagnosis" min={0} max={100} placeholder="e.g. 10" bind:value={d.yearsDuration} />
		</Field>
		<Field label="Diagnosis Method" inputId="diagnosisMethod">
			<Select id="diagnosisMethod" label="Diagnosis Method" bind:value={d.diagnosisMethod}>
				<option value="">-- Select --</option>
				<option value="hba1c">HbA1c</option>
				<option value="fastingGlucose">Fasting Glucose</option>
				<option value="ogtt">OGTT</option>
				<option value="randomGlucose">Random Glucose</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Family History of Diabetes">
			<RadioGroup label="Family History of Diabetes">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="familyHistory" value={opt.value} bind:group={d.familyHistory} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Autoantibodies Tested" inputId="autoantibodiesTested">
			<Select id="autoantibodiesTested" label="Autoantibodies Tested" bind:value={d.autoantibodiesTested}>
				<option value="">-- Select --</option>
				<option value="yes">Yes - Positive</option>
				<option value="negative">Yes - Negative</option>
				<option value="notTested">Not Tested</option>
			</Select>
		</Field>
	</div>
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
