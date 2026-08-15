<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.immediatePostopStatus;

	const consciousOptions = [
		{ value: 'awake', label: 'Awake and alert' },
		{ value: 'drowsy', label: 'Drowsy but rousable' },
		{ value: 'sedated', label: 'Sedated' },
		{ value: 'intubated', label: 'Intubated and ventilated' },
		{ value: 'unresponsive', label: 'Unresponsive' }
	];
	const dispositionOptions = [
		{ value: 'recovery', label: 'Recovery / PACU' },
		{ value: 'ward', label: 'Surgical ward' },
		{ value: 'hdu', label: 'High dependency unit (HDU)' },
		{ value: 'icu', label: 'Intensive care unit (ICU)' },
		{ value: 'theatre', label: 'Returned to theatre' },
		{ value: 'home', label: 'Discharged home (day case)' }
	];
</script>

<Fieldset legend="Immediate Post-op Status">
	<p class="hint">Patient status on arrival in recovery.</p>

	<Field label="Conscious level" inputId="consciousLevel">
		<Select label="Conscious level" bind:value={d.consciousLevel}>
			<option value="">— Select —</option>
			{#each consciousOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="Systolic BP (mmHg)" inputId="systolicBp">
			<NumberInput id="systolicBp" label="Systolic BP" min={0} max={300} bind:value={d.systolicBp} />
		</Field>
		<Field label="Diastolic BP (mmHg)" inputId="diastolicBp">
			<NumberInput id="diastolicBp" label="Diastolic BP" min={0} max={200} bind:value={d.diastolicBp} />
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="Heart rate (bpm)" inputId="heartRate">
			<NumberInput id="heartRate" label="Heart rate" min={0} max={250} bind:value={d.heartRate} />
		</Field>
		<Field label="Respiratory rate (/min)" inputId="respiratoryRate">
			<NumberInput id="respiratoryRate" label="Respiratory rate" min={0} max={80} bind:value={d.respiratoryRate} />
		</Field>
		<Field label="SpO2 (%)" inputId="oxygenSaturation">
			<NumberInput id="oxygenSaturation" label="SpO2" min={0} max={100} bind:value={d.oxygenSaturation} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Temperature (°C)" inputId="temperature">
			<NumberInput id="temperature" label="Temperature" min={25} max={45} step={0.1} bind:value={d.temperature} />
		</Field>
		<Field label="Pain score (0–10)" inputId="painScore">
			<NumberInput id="painScore" label="Pain score" min={0} max={10} bind:value={d.painScore} />
		</Field>
	</div>

	<Field label="Pain notes" inputId="painNotes">
		<TextAreaInput id="painNotes" label="Pain notes" rows={2} placeholder="Quality of pain, location, response to analgesia." bind:value={d.painNotes} />
	</Field>

	<Field label="Disposition from theatre" inputId="disposition">
		<Select label="Disposition from theatre" bind:value={d.disposition}>
			<option value="">— Select —</option>
			{#each dispositionOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
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
