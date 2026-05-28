<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gcsTotal } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.disability;

	const avpuOptions = [
		{ value: 'A', label: 'A — Alert' },
		{ value: 'V', label: 'V — Voice' },
		{ value: 'P', label: 'P — Pain' },
		{ value: 'U', label: 'U — Unresponsive' }
	];

	const gcs = $derived(gcsTotal(assessment.data));
</script>

<Fieldset
	title="Disability (D)"
	description="Primary survey: neurological assessment, GCS, pupils and interventions."
>
	<Checkbox label="Normal (NML)" name="disabilityNormal" bind:checked={d.normal} />

	<NumberInput
		label="Blood glucose (as needed)"
		name="bloodGlucose"
		bind:value={d.bloodGlucose}
		unit="mmol/L"
		step={0.1}
		min={0}
		max={50}
	/>

	<RadioGroup
		label="Responsiveness (AVPU)"
		name="avpu"
		options={avpuOptions}
		bind:value={d.avpu}
		required
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">GCS</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
		<NumberInput label="Eye (E)" name="gcsEye" bind:value={d.gcsEye} unit="1–4" min={1} max={4} />
		<NumberInput
			label="Verbal (V)"
			name="gcsVerbal"
			bind:value={d.gcsVerbal}
			unit="1–5"
			min={1}
			max={5}
		/>
		<NumberInput label="Motor (M)" name="gcsMotor" bind:value={d.gcsMotor} unit="1–6" min={1} max={6} />
	</div>
	<p class="mb-3 text-sm text-gray-600">
		GCS total: <span class="font-semibold text-gray-900">{gcs ?? '—'}</span>
	</p>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Moves extremities</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="L arm" name="movesLeftArm" bind:checked={d.movesLeftArm} />
		<Checkbox label="R arm" name="movesRightArm" bind:checked={d.movesRightArm} />
		<Checkbox label="L leg" name="movesLeftLeg" bind:checked={d.movesLeftLeg} />
		<Checkbox label="R leg" name="movesRightLeg" bind:checked={d.movesRightLeg} />
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Pupils</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput
			label="Size L"
			name="pupilSizeLeft"
			bind:value={d.pupilSizeLeft}
			unit="mm"
			step={0.5}
			min={0}
			max={10}
		/>
		<NumberInput
			label="Size R"
			name="pupilSizeRight"
			bind:value={d.pupilSizeRight}
			unit="mm"
			step={0.5}
			min={0}
			max={10}
		/>
		<TextInput
			label="Reactivity L"
			name="pupilReactivityLeft"
			bind:value={d.pupilReactivityLeft}
		/>
		<TextInput
			label="Reactivity R"
			name="pupilReactivityRight"
			bind:value={d.pupilReactivityRight}
		/>
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Interventions</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox
			label="Glucose checked"
			name="interventionGlucoseChecked"
			bind:checked={d.interventionGlucoseChecked}
		/>
		<Checkbox
			label="Glucose given"
			name="interventionGlucoseGiven"
			bind:checked={d.interventionGlucoseGiven}
		/>
		<Checkbox
			label="Naloxone given"
			name="interventionNaloxoneGiven"
			bind:checked={d.interventionNaloxoneGiven}
		/>
	</div>

	<TextAreaInput label="Notes" name="disabilityNotes" bind:value={d.notes} rows={2} />
</Fieldset>
