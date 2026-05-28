<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

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
	description="Primary survey — neurological status (AVPU), motor exam, pupils, blood glucose and interventions."
>
	<Checkbox label="Normal (no abnormal findings)" name="disabilityNormal" bind:checked={d.normal} />

	<RadioGroup label="AVPU" name="avpu" options={avpuOptions} bind:value={d.avpu} required />

	<Checkbox label="Moves all extremities" name="movesAllExtremities" bind:checked={d.movesAllExtremities} />
	<Checkbox label="Deficit (describe below)" name="deficit" bind:checked={d.deficit} />
	{#if d.deficit}
		<TextAreaInput label="Deficit description" name="deficitDescription" bind:value={d.deficitDescription} rows={2} required />
	{/if}

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Pupils</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Size L" name="pupilSizeLeft" bind:value={d.pupilSizeLeft} unit="mm" min={0} max={10} step={0.5} />
		<NumberInput label="Size R" name="pupilSizeRight" bind:value={d.pupilSizeRight} unit="mm" min={0} max={10} step={0.5} />
		<TextInput label="Reactivity L" name="pupilReactivityLeft" bind:value={d.pupilReactivityLeft} placeholder="brisk / sluggish / fixed" />
		<TextInput label="Reactivity R" name="pupilReactivityRight" bind:value={d.pupilReactivityRight} placeholder="brisk / sluggish / fixed" />
	</div>

	<NumberInput
		label="Blood glucose (abnormal if < 3.5 mmol/L)"
		name="bloodGlucoseMmol"
		bind:value={d.bloodGlucoseMmol}
		unit="mmol/L"
		min={0}
		max={50}
		step={0.1}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Interventions</h3>
	<Checkbox label="Glucose" name="interventionGlucose" bind:checked={d.interventionGlucose} />
	<Checkbox label="Antiepileptic" name="interventionAntiepileptic" bind:checked={d.interventionAntiepileptic} />
	<Checkbox label="Naloxone" name="interventionNaloxone" bind:checked={d.interventionNaloxone} />
	<TextInput label="Other interventions" name="interventionOthers" bind:value={d.interventionOthers} />

	<TextAreaInput label="Notes" name="disabilityNotes" bind:value={d.notes} rows={2} />
</Fieldset>
