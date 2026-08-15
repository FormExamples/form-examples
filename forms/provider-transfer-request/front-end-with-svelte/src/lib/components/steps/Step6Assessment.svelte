<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.assessment;
	const v = d.vitalSigns;

	const consciousOptions = [
		{ value: 'awake', label: 'Awake / alert' },
		{ value: 'drowsy', label: 'Drowsy' },
		{ value: 'unresponsive', label: 'Unresponsive' }
	];
	const stableOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Assessment (A) — Current Clinical Status">
	<p class="hint">Summary of how the patient is now and the latest set of vital signs.</p>

	<Field label="Current clinical status" required inputId="currentClinicalStatus">
		<TextAreaInput id="currentClinicalStatus" label="Current clinical status" rows={4} required bind:value={d.currentClinicalStatus} />
	</Field>

	<Field label="Conscious level" required>
		<RadioGroup label="Conscious level">
			{#each consciousOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="consciousLevel" value={opt.value} bind:group={d.consciousLevel} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<h3 class="subsection-heading">Vital signs</h3>
	<div class="vitals-grid">
		<Field label="Heart rate (bpm)" inputId="heartRate">
			<NumberInput id="heartRate" label="Heart rate" min={0} max={300} step={1} bind:value={v.heartRate} />
		</Field>
		<Field label="Respiratory rate (/min)" inputId="respiratoryRate">
			<NumberInput id="respiratoryRate" label="Respiratory rate" min={0} max={80} step={1} bind:value={v.respiratoryRate} />
		</Field>
		<Field label="Systolic BP (mmHg)" inputId="systolicBloodPressure">
			<NumberInput id="systolicBloodPressure" label="Systolic BP" min={0} max={300} step={1} bind:value={v.systolicBloodPressure} />
		</Field>
		<Field label="Diastolic BP (mmHg)" inputId="diastolicBloodPressure">
			<NumberInput id="diastolicBloodPressure" label="Diastolic BP" min={0} max={200} step={1} bind:value={v.diastolicBloodPressure} />
		</Field>
		<Field label="Temperature (°C)" inputId="temperatureCelsius">
			<NumberInput id="temperatureCelsius" label="Temperature" min={25} max={45} step={0.1} bind:value={v.temperatureCelsius} />
		</Field>
		<Field label="Oxygen saturation (%)" inputId="oxygenSaturation">
			<NumberInput id="oxygenSaturation" label="Oxygen saturation" min={0} max={100} step={1} bind:value={v.oxygenSaturation} />
		</Field>
		<Field label="NEWS2 score" inputId="newsScore">
			<NumberInput id="newsScore" label="NEWS2 score" min={0} max={20} step={1} bind:value={v.newsScore} />
		</Field>
	</div>

	<Field label="Clinically stable for transfer?" required>
		<RadioGroup label="Clinically stable for transfer?">
			{#each stableOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="clinicallyStable" value={opt.value} bind:group={d.clinicallyStable} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.clinicallyStable === 'no' || d.clinicallyStable === 'unknown'}
		<Field label="Stability notes / concerns" required={d.clinicallyStable === 'no'} inputId="stabilityNotes">
			<TextAreaInput
				id="stabilityNotes"
				label="Stability notes / concerns"
				rows={3}
				required={d.clinicallyStable === 'no'}
				placeholder="Describe instability and what is being done about it."
				bind:value={d.stabilityNotes}
			/>
		</Field>
	{/if}
</Fieldset>

<style>
	.subsection-heading {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
	.vitals-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.vitals-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
