<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.cardiovascularRisk;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cardiovascular Risk">
	<p class="hint">Assess cardiovascular risk factors and current management.</p>

	<div class="field-grid">
		<Field label="Systolic BP (mmHg)" inputId="systolicBp">
			<NumberInput id="systolicBp" label="Systolic BP" min={60} max={300} placeholder="e.g. 130" bind:value={d.systolicBp} />
		</Field>
		<Field label="Diastolic BP (mmHg)" inputId="diastolicBp">
			<NumberInput id="diastolicBp" label="Diastolic BP" min={30} max={200} placeholder="e.g. 80" bind:value={d.diastolicBp} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="On Antihypertensive" inputId="onAntihypertensive">
			<Select id="onAntihypertensive" label="On Antihypertensive" bind:value={d.onAntihypertensive}>
				<option value="">-- Select --</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</Select>
		</Field>
		<Field label="On Statin" inputId="onStatin">
			<Select id="onStatin" label="On Statin" bind:value={d.onStatin}>
				<option value="">-- Select --</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="intolerant">Statin Intolerant</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Total Cholesterol (mmol/L)" inputId="totalCholesterol">
			<NumberInput id="totalCholesterol" label="Total Cholesterol" step={0.1} min={0} placeholder="e.g. 4.5" bind:value={d.totalCholesterol} />
		</Field>
		<Field label="LDL Cholesterol (mmol/L)" inputId="ldlCholesterol">
			<NumberInput id="ldlCholesterol" label="LDL Cholesterol" step={0.1} min={0} placeholder="e.g. 2.0" bind:value={d.ldlCholesterol} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Smoking Status" inputId="smokingStatus">
			<Select id="smokingStatus" label="Smoking Status" bind:value={d.smokingStatus}>
				<option value="">-- Select --</option>
				<option value="never">Never Smoked</option>
				<option value="exSmoker">Ex-Smoker</option>
				<option value="currentSmoker">Current Smoker</option>
			</Select>
		</Field>
		<Field label="Previous CVD Event">
			<RadioGroup label="Previous CVD Event">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="previousCvdEvent" value={opt.value} bind:group={d.previousCvdEvent} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<Field label="QRISK Score (%)" inputId="qriskScore">
		<NumberInput id="qriskScore" label="QRISK Score" step={0.1} min={0} max={100} placeholder="e.g. 15.2" bind:value={d.qriskScore} />
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
