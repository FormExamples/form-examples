<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const cv = assessment.data.cardiovascularRisk;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cardiovascular Risk">
	<p class="hint">Cardiovascular history and risk assessment.</p>

	<h3 class="section-h">Blood Pressure &amp; Heart Rate</h3>
	<div class="field-grid field-grid-3">
		<Field label="Systolic BP (mmHg)" inputId="systolic">
			<NumberInput id="systolic" label="Systolic" min={60} max={250} bind:value={cv.bloodPressureSystolic} />
		</Field>
		<Field label="Diastolic BP (mmHg)" inputId="diastolic">
			<NumberInput id="diastolic" label="Diastolic" min={30} max={150} bind:value={cv.bloodPressureDiastolic} />
		</Field>
		<Field label="Heart Rate (bpm)" inputId="heartRate">
			<NumberInput id="heartRate" label="Heart rate" min={30} max={200} bind:value={cv.heartRate} />
		</Field>
	</div>

	<h3 class="section-h">Cardiovascular History</h3>
	<Field label="Previous myocardial infarction (heart attack)">
		<RadioGroup label="Previous MI">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousMI" value={opt.value} bind:group={cv.previousMI} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Heart failure">
		<RadioGroup label="Heart failure">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="heartFailure" value={opt.value} bind:group={cv.heartFailure} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Peripheral vascular disease">
		<RadioGroup label="PVD">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="peripheralVascularDisease" value={opt.value} bind:group={cv.peripheralVascularDisease} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Cerebrovascular disease (stroke/TIA)">
		<RadioGroup label="Cerebrovascular disease">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cerebrovascularDisease" value={opt.value} bind:group={cv.cerebrovascularDisease} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<h3 class="section-h">Risk Score</h3>
	<Field label="QRISK Score (%)" inputId="qriskScore">
		<NumberInput id="qriskScore" label="QRISK" min={0} max={100} step={0.1} bind:value={cv.qriskScore} />
	</Field>
</Fieldset>

<style>
	.section-h { font-weight: 600; margin: 1rem 0 0.5rem; color: var(--color-text); }
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	.field-grid.field-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	@media (max-width: 640px) { .field-grid, .field-grid.field-grid-3 { grid-template-columns: 1fr; } }
</style>
