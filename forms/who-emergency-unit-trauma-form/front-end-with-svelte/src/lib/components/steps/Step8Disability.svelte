<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.disability;

	const avpuOptions = [
		{ value: 'A', label: 'A — Alert' },
		{ value: 'V', label: 'V — Voice' },
		{ value: 'P', label: 'P — Pain' },
		{ value: 'U', label: 'U — Unresponsive' }
	];
</script>

<Fieldset
	title="Disability (D)"
	description="Neurological status — AVPU, GCS, motor exam in 4 extremities, pupils, blood glucose and interventions."
>
	<Checkbox label="Normal (no abnormal findings)" name="disabilityNormal" bind:checked={d.normal} />

	<RadioGroup label="AVPU (Alert / Voice / Pain / Unresponsive)" name="avpu" options={avpuOptions} bind:value={d.avpu} required />

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">GCS (Glasgow Coma Scale)</h3>
	<div class="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
		<NumberInput label="GCS Total" name="gcsTotal" bind:value={d.gcsTotal} min={3} max={15} />
		<NumberInput label="E (Eye)" name="gcsEye" bind:value={d.gcsEye} min={1} max={4} />
		<NumberInput label="V (Verbal)" name="gcsVerbal" bind:value={d.gcsVerbal} min={1} max={5} />
		<NumberInput label="M (Motor)" name="gcsMotor" bind:value={d.gcsMotor} min={1} max={6} />
	</div>
	<Checkbox
		label="Qualified GCS (sedated, intubated, vision obstructed)"
		name="gcsQualified"
		bind:checked={d.gcsQualified}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Moves extremities</h3>
	<Checkbox label="RUE (right upper extremity)" name="movesRue" bind:checked={d.movesRue} />
	<Checkbox label="LUE (left upper extremity)" name="movesLue" bind:checked={d.movesLue} />
	<Checkbox label="RLE (right lower extremity)" name="movesRle" bind:checked={d.movesRle} />
	<Checkbox label="LLE (left lower extremity)" name="movesLle" bind:checked={d.movesLle} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Pupils</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Size L" name="pupilSizeLeft" bind:value={d.pupilSizeLeft} unit="mm" min={0} max={10} step={0.5} />
		<NumberInput label="Size R" name="pupilSizeRight" bind:value={d.pupilSizeRight} unit="mm" min={0} max={10} step={0.5} />
		<TextInput label="Reactivity L" name="pupilReactivityLeft" bind:value={d.pupilReactivityLeft} placeholder="brisk / sluggish / fixed" />
		<TextInput label="Reactivity R" name="pupilReactivityRight" bind:value={d.pupilReactivityRight} placeholder="brisk / sluggish / fixed" />
	</div>

	<NumberInput
		label="Blood glucose (abnormal if < 65 mg/dL)"
		name="bloodGlucose"
		bind:value={d.bloodGlucose}
		unit="mg/dL"
		min={0}
		max={1000}
		step={1}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Interventions</h3>
	<Checkbox label="Glucose" name="interventionGlucose" bind:checked={d.interventionGlucose} />
	<Checkbox label="Antidote" name="interventionAntidote" bind:checked={d.interventionAntidote} />
	<Checkbox label="Antiepileptic" name="interventionAntiepileptic" bind:checked={d.interventionAntiepileptic} />
	<Checkbox label="Raise head of bed" name="interventionRaiseHeadOfBed" bind:checked={d.interventionRaiseHeadOfBed} />
	<TextInput label="Other interventions" name="interventionOther" bind:value={d.interventionOther} />

	<TextAreaInput label="Notes" name="disabilityNotes" bind:value={d.notes} rows={2} />
</Fieldset>
