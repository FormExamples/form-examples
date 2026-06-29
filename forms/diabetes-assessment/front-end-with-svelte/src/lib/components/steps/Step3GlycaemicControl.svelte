<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.glycaemicControl;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Glycaemic Control">
	<p class="hint">Record current glycaemic markers and monitoring approach.</p>

	<div class="field-grid">
		<Field label="HbA1c Value" inputId="hba1cValue">
			<NumberInput id="hba1cValue" label="HbA1c Value" step={0.1} min={0} placeholder="e.g. 53 or 7.0" bind:value={d.hba1cValue} />
		</Field>
		<Field label="HbA1c Unit" inputId="hba1cUnit">
			<Select id="hba1cUnit" label="HbA1c Unit" bind:value={d.hba1cUnit}>
				<option value="">-- Select --</option>
				<option value="mmolMol">mmol/mol</option>
				<option value="percent">% (DCCT)</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Agreed HbA1c Target" inputId="hba1cTarget">
			<NumberInput id="hba1cTarget" label="Agreed HbA1c Target" step={0.1} min={0} placeholder="e.g. 48 or 6.5" bind:value={d.hba1cTarget} />
		</Field>
		<Field label="Time in Range (%)" inputId="timeInRange">
			<NumberInput id="timeInRange" label="Time in Range" min={0} max={100} placeholder="e.g. 70" bind:value={d.timeInRange} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Fasting Glucose (mmol/L)" inputId="fastingGlucose">
			<NumberInput id="fastingGlucose" label="Fasting Glucose" step={0.1} min={0} placeholder="e.g. 5.5" bind:value={d.fastingGlucose} />
		</Field>
		<Field label="Postprandial Glucose (mmol/L)" inputId="postprandialGlucose">
			<NumberInput id="postprandialGlucose" label="Postprandial Glucose" step={0.1} min={0} placeholder="e.g. 7.8" bind:value={d.postprandialGlucose} />
		</Field>
	</div>

	<Field label="Glucose Monitoring Method" inputId="glucoseMonitoringType">
		<Select id="glucoseMonitoringType" label="Glucose Monitoring Method" bind:value={d.glucoseMonitoringType}>
			<option value="">-- Select --</option>
			<option value="smbg">Self-Monitoring Blood Glucose (SMBG)</option>
			<option value="cgm">Continuous Glucose Monitor (CGM)</option>
			<option value="flash">Flash Glucose Monitor</option>
			<option value="none">None</option>
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="Hypoglycaemia Frequency" inputId="hypoglycaemiaFrequency">
			<Select id="hypoglycaemiaFrequency" label="Hypoglycaemia Frequency" bind:value={d.hypoglycaemiaFrequency}>
				<option value="">-- Select --</option>
				<option value="never">Never</option>
				<option value="rarely">Rarely (less than monthly)</option>
				<option value="monthly">Monthly</option>
				<option value="weekly">Weekly</option>
				<option value="daily">Daily</option>
			</Select>
		</Field>
		<Field label="Severe Hypoglycaemia (requiring assistance)">
			<RadioGroup label="Severe Hypoglycaemia">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="severeHypoglycaemia" value={opt.value} bind:group={d.severeHypoglycaemia} /> {opt.label}</label>
				{/each}
			</RadioGroup>
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
