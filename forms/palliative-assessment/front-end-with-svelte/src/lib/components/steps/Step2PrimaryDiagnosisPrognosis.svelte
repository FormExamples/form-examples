<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.primaryDiagnosisPrognosis;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Primary Diagnosis & Prognosis">
	<p class="hint">The life-limiting diagnosis, disease trajectory, and prognostic indicators.</p>

	<Field label="Primary diagnosis" inputId="primaryDiagnosis">
		<TextInput id="primaryDiagnosis" label="Primary diagnosis" placeholder="e.g. Metastatic pancreatic cancer" bind:value={d.primaryDiagnosis} />
	</Field>

	<Field label="Secondary diagnoses" inputId="secondaryDiagnoses">
		<TextAreaInput id="secondaryDiagnoses" label="Secondary diagnoses" rows={2} bind:value={d.secondaryDiagnoses} />
	</Field>

	<div class="field-grid">
		<Field label="Date of diagnosis" inputId="dateOfDiagnosis">
			<DateInput id="dateOfDiagnosis" label="Date of diagnosis" bind:value={d.dateOfDiagnosis} />
		</Field>
		<Field label="Stage / severity" inputId="stageOrSeverity">
			<TextInput id="stageOrSeverity" label="Stage / severity" placeholder="e.g. Stage IV" bind:value={d.stageOrSeverity} />
		</Field>
	</div>

	<Field label="Is the disease progressing?">
		<RadioGroup label="Is the disease progressing?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diseaseProgressing" value={opt.value} bind:group={d.diseaseProgressing} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Prognosis horizon" inputId="prognosisHorizon">
		<Select id="prognosisHorizon" label="Prognosis horizon" bind:value={d.prognosisHorizon}>
			<option value="">-- Select --</option>
			<option value="days">Days</option>
			<option value="weeks">Weeks</option>
			<option value="months">Months</option>
			<option value="years">Years</option>
			<option value="uncertain">Uncertain</option>
		</Select>
	</Field>

	<Field label="Surprise question: would you be surprised if this patient died in the next 12 months?">
		<RadioGroup label="Surprise question">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="surpriseQuestion" value={opt.value} bind:group={d.surpriseQuestion} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Prognostic indicators" inputId="prognosticIndicators">
		<TextAreaInput id="prognosticIndicators" label="Prognostic indicators" rows={2} placeholder="e.g. weight loss, recurrent admissions, declining function" bind:value={d.prognosticIndicators} />
	</Field>

	<Field label="Relevant treatment history" inputId="relevantTreatmentHistory">
		<TextAreaInput id="relevantTreatmentHistory" label="Relevant treatment history" rows={2} bind:value={d.relevantTreatmentHistory} />
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
