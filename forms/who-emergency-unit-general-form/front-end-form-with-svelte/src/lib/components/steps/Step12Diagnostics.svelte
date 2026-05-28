<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.diagnostics;

	const labResults = [
		{ value: 'pos', label: 'Pos' },
		{ value: 'neg', label: 'Neg' },
		{ value: 'pending', label: 'Pending' }
	];

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Diagnostics"
	description="Labs (CBC, electrolytes, UPT, malaria, HIV, urine dip), ECG and other imaging."
>
	<h3 class="mb-2 text-base font-semibold text-gray-800">CBC (complete blood count)</h3>
	<div class="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
		<NumberInput label="WBC" name="wbc" bind:value={d.cbc.wbc} step={0.1} min={0} />
		<NumberInput label="Hgb" name="hgb" bind:value={d.cbc.hgb} step={0.1} min={0} />
		<NumberInput label="Plt" name="plt" bind:value={d.cbc.plt} min={0} />
		<NumberInput label="Hct" name="hct" bind:value={d.cbc.hct} step={0.1} min={0} max={100} />
	</div>
	<Checkbox label="CBC: Result pending" name="cbcPending" bind:checked={d.cbc.pending} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Lytes / Cr / glucose</h3>
	<div class="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
		<NumberInput label="Na" name="na" bind:value={d.lytes.na} min={0} />
		<NumberInput label="Cl" name="cl" bind:value={d.lytes.cl} min={0} />
		<NumberInput label="BUN" name="bun" bind:value={d.lytes.bun} step={0.1} min={0} />
		<NumberInput label="K" name="k" bind:value={d.lytes.k} step={0.1} min={0} />
		<NumberInput label="HCO3" name="hco3" bind:value={d.lytes.hco3} step={0.1} min={0} />
		<NumberInput label="Cr" name="cr" bind:value={d.lytes.cr} step={0.01} min={0} />
		<NumberInput label="Glucose" name="lytesGlucose" bind:value={d.lytes.glucose} step={0.1} min={0} />
	</div>
	<Checkbox label="Lytes: Result pending" name="lytesPending" bind:checked={d.lytes.pending} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Rapid tests</h3>
	<RadioGroup label="UPT (urine pregnancy test)" name="upt" options={labResults} bind:value={d.upt} />
	<RadioGroup label="Malaria" name="malaria" options={labResults} bind:value={d.malaria} />
	<RadioGroup label="HIV rapid" name="hivRapid" options={labResults} bind:value={d.hivRapid} />

	<TextInput label="Blood type" name="bloodType" bind:value={d.bloodType} placeholder="e.g. O+, A-" />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Urine dip</h3>
	<Checkbox label="Glucose" name="urineGlucose" bind:checked={d.urineDip.glucose} />
	<Checkbox label="Nitrites" name="urineNitrites" bind:checked={d.urineDip.nitrites} />
	<Checkbox label="Ketones" name="urineKetones" bind:checked={d.urineDip.ketones} />
	<Checkbox label="Leukocytes" name="urineLeukocytes" bind:checked={d.urineDip.leukocytes} />
	<Checkbox label="Blood" name="urineBlood" bind:checked={d.urineDip.blood} />
	<Checkbox label="Protein" name="urineProtein" bind:checked={d.urineDip.protein} />

	<TextAreaInput label="Other labs / imaging" name="otherLabsImaging" bind:value={d.otherLabsImaging} rows={3} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">ECG</h3>
	<NumberInput label="Rate" name="ecgRate" bind:value={d.ecg.rate} unit="bpm" min={0} max={300} />
	<RadioGroup label="Sinus rhythm?" name="sinusRhythm" options={yesNo} bind:value={d.ecg.sinusRhythm} />
	<RadioGroup label="Ischemia?" name="ischemia" options={yesNo} bind:value={d.ecg.ischemia} />
	<TextAreaInput label="Interpretation" name="ecgInterpretation" bind:value={d.ecg.interpretation} rows={3} />
</Fieldset>
