<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.organFunction;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="4. Organ Function Assessment">
	<p class="hint">Laboratory and imaging assessments of kidney, liver, heart, lung, and pancreas function.</p>

	<h3 class="sub-header">Renal</h3>
	<div class="field-grid">
		<Field label="Creatinine (µmol/L)" inputId="creatinine">
			<NumberInput id="creatinine" label="Creatinine" min={0} max={2000} bind:value={d.creatinine} />
		</Field>
		<Field label="eGFR (mL/min/1.73m²)" inputId="egfr">
			<NumberInput id="egfr" label="eGFR" min={0} max={200} bind:value={d.egfr} />
		</Field>
	</div>
	<Field label="Kidney imaging" inputId="kidneyImaging">
		<Select id="kidneyImaging" label="Kidney imaging" bind:value={d.kidneyImaging}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="pending">Pending</option>
		</Select>
	</Field>
	<Field label="Kidney notes" inputId="kidneyNotes">
		<TextAreaInput id="kidneyNotes" label="Kidney notes" rows={2} placeholder="CT angiography, ultrasound, anatomic findings…" bind:value={d.kidneyNotes} />
	</Field>

	<h3 class="sub-header">Hepatic</h3>
	<div class="field-grid field-grid-3">
		<Field label="ALT (U/L)" inputId="alt">
			<NumberInput id="alt" label="ALT" min={0} max={2000} bind:value={d.alt} />
		</Field>
		<Field label="AST (U/L)" inputId="ast">
			<NumberInput id="ast" label="AST" min={0} max={2000} bind:value={d.ast} />
		</Field>
		<Field label="Bilirubin (µmol/L)" inputId="bilirubin">
			<NumberInput id="bilirubin" label="Bilirubin" min={0} max={1000} bind:value={d.bilirubin} />
		</Field>
	</div>
	<Field label="Liver imaging" inputId="liverImaging">
		<Select id="liverImaging" label="Liver imaging" bind:value={d.liverImaging}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="pending">Pending</option>
		</Select>
	</Field>
	<Field label="Liver notes" inputId="liverNotes">
		<TextAreaInput id="liverNotes" label="Liver notes" rows={2} placeholder="Ultrasound, MRI, steatosis, anatomic notes…" bind:value={d.liverNotes} />
	</Field>

	<h3 class="sub-header">Cardiac</h3>
	<div class="field-grid">
		<Field label="Ejection fraction (%)" inputId="ejectionFraction">
			<NumberInput id="ejectionFraction" label="Ejection fraction" min={0} max={100} bind:value={d.ejectionFraction} />
		</Field>
		<Field label="Echocardiogram" inputId="echocardiogram">
			<Select id="echocardiogram" label="Echocardiogram" bind:value={d.echocardiogram}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
				<option value="pending">Pending</option>
			</Select>
		</Field>
	</div>
	<Field label="Cardiac notes" inputId="cardiacNotes">
		<TextAreaInput id="cardiacNotes" label="Cardiac notes" rows={2} placeholder="Wall motion, valve disease, coronary findings…" bind:value={d.cardiacNotes} />
	</Field>

	<h3 class="sub-header">Pulmonary</h3>
	<div class="field-grid">
		<Field label="PaO2 / FiO2 ratio" inputId="pao2Fio2Ratio">
			<NumberInput id="pao2Fio2Ratio" label="PaO2 / FiO2 ratio" min={0} max={600} bind:value={d.pao2Fio2Ratio} />
		</Field>
		<Field label="Chest imaging" inputId="chestImaging">
			<Select id="chestImaging" label="Chest imaging" bind:value={d.chestImaging}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
				<option value="pending">Pending</option>
			</Select>
		</Field>
	</div>
	<Field label="Pulmonary notes" inputId="pulmonaryNotes">
		<TextAreaInput id="pulmonaryNotes" label="Pulmonary notes" rows={2} placeholder="Chest X-ray / CT, contusion, infection, secretions…" bind:value={d.pulmonaryNotes} />
	</Field>

	<h3 class="sub-header">Pancreatic</h3>
	<div class="field-grid">
		<Field label="Fasting glucose (mmol/L)" inputId="fastingGlucose">
			<NumberInput id="fastingGlucose" label="Fasting glucose" min={0} max={50} step={0.1} bind:value={d.fastingGlucose} />
		</Field>
		<Field label="HbA1c (%)" inputId="hba1c">
			<NumberInput id="hba1c" label="HbA1c" min={0} max={20} step={0.1} bind:value={d.hba1c} />
		</Field>
	</div>
	<Field label="Pancreatic notes" inputId="pancreaticNotes">
		<TextAreaInput id="pancreaticNotes" label="Pancreatic notes" rows={2} placeholder="Lipase, amylase, imaging…" bind:value={d.pancreaticNotes} />
	</Field>

	<Field label="Severe organ failure incompatible with donation?">
		<RadioGroup label="Severe organ failure incompatible with donation?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="severeOrganFailure" value={opt.value} bind:group={d.severeOrganFailure} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.severeOrganFailure === 'yes'}
		<Field label="Severe organ failure details" inputId="severeOrganFailureDetails">
			<TextAreaInput id="severeOrganFailureDetails" label="Severe organ failure details" rows={2} placeholder="Which organ(s), nature of failure…" bind:value={d.severeOrganFailureDetails} />
		</Field>
	{/if}
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
	.sub-header {
		margin: 1.25rem 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
	}
</style>
