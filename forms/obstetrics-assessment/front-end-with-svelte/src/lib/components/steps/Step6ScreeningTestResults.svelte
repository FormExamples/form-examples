<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.screeningResults;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const combinedTest = [
		{ value: 'lower-chance', label: 'Lower chance' },
		{ value: 'higher-chance', label: 'Higher chance' },
		{ value: 'declined', label: 'Declined' },
		{ value: 'pending', label: 'Pending' }
	];
</script>

<Fieldset legend="Screening Test Results">
	<p class="hint">Combined test, anomaly scan, GTT, blood group, infection screen.</p>

	<Field label="Combined test result">
		<RadioGroup label="Combined test result">
			{#each combinedTest as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="combinedTestResult" value={opt.value} bind:group={r.combinedTestResult} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Combined test risk (e.g. 1:200)" inputId="combinedTestRisk">
		<TextInput id="combinedTestRisk" label="Combined test risk" bind:value={r.combinedTestRisk} />
	</Field>

	<Field label="Anomaly scan completed?">
		<RadioGroup label="Anomaly scan completed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anomalyScanCompleted" value={opt.value} bind:group={r.anomalyScanCompleted} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.anomalyScanCompleted === 'yes'}
		<Field label="Anomaly scan findings" inputId="anomalyScanFindings">
			<Select id="anomalyScanFindings" label="Anomaly scan findings" bind:value={r.anomalyScanFindings}>
				<option value="">— Select —</option>
				<option value="normal">Normal</option>
				<option value="soft-marker">Soft marker only</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
	{/if}

	<Field label="Glucose tolerance test (GTT) result" inputId="gttResult">
		<Select id="gttResult" label="GTT result" bind:value={r.gttResult}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="gdm-confirmed">GDM confirmed</option>
			<option value="declined">Declined</option>
			<option value="pending">Pending</option>
			<option value="not-indicated">Not indicated</option>
		</Select>
	</Field>
	<div class="field-grid">
		<Field label="GTT fasting glucose (mmol/L)" inputId="gttFasting">
			<NumberInput id="gttFasting" label="GTT fasting glucose" min={0} max={30} step={0.1} bind:value={r.gttFasting} />
		</Field>
		<Field label="GTT 2-hour glucose (mmol/L)" inputId="gttTwoHour">
			<NumberInput id="gttTwoHour" label="GTT 2-hour glucose" min={0} max={30} step={0.1} bind:value={r.gttTwoHour} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Blood group" inputId="bloodGroup">
			<Select id="bloodGroup" label="Blood group" bind:value={r.bloodGroup}>
				<option value="">— Select —</option>
				<option value="O">O</option>
				<option value="A">A</option>
				<option value="B">B</option>
				<option value="AB">AB</option>
			</Select>
		</Field>
		<Field label="Rhesus status" inputId="rhesusStatus">
			<Select id="rhesusStatus" label="Rhesus status" bind:value={r.rhesusStatus}>
				<option value="">— Select —</option>
				<option value="positive">Positive</option>
				<option value="negative">Negative</option>
			</Select>
		</Field>
	</div>

	<Field label="Red-cell antibody screen positive?">
		<RadioGroup label="Red-cell antibody screen positive?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="antibodyScreenPositive" value={opt.value} bind:group={r.antibodyScreenPositive} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Infection screen abnormal (HIV/Hep B/syphilis)?">
		<RadioGroup label="Infection screen abnormal?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="infectionScreenAbnormal" value={opt.value} bind:group={r.infectionScreenAbnormal} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.infectionScreenAbnormal === 'yes'}
		<Field label="Infection screen details" inputId="infectionScreenDetails">
			<TextInput id="infectionScreenDetails" label="Infection screen details" bind:value={r.infectionScreenDetails} />
		</Field>
	{/if}

	<Field label="Haemoglobin (g/L)" inputId="haemoglobin">
		<TextInput id="haemoglobin" label="Haemoglobin" bind:value={r.haemoglobin} />
	</Field>

	<Field label="Other screening notes" inputId="screeningNotes">
		<TextAreaInput id="screeningNotes" label="Other screening notes" rows={3} placeholder="Other screening or diagnostic information." bind:value={r.screeningNotes} />
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
