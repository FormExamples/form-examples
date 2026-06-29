<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.photographyDocumentation;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Photography &amp; Documentation">
	<p class="hint">Clinical photography, measurements, and prior imaging.</p>

	<Field label="Clinical photos taken?">
		<RadioGroup label="Clinical photos taken?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="clinicalPhotosTaken" value={opt.value} bind:group={d.clinicalPhotosTaken} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.clinicalPhotosTaken === 'yes'}
		<Field label="Photo consent obtained?">
			<RadioGroup label="Photo consent obtained?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="photoConsentObtained" value={opt.value} bind:group={d.photoConsentObtained} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Number of photos" inputId="numberOfPhotos">
			<NumberInput id="numberOfPhotos" label="Number of photos" min={0} bind:value={d.numberOfPhotos} />
		</Field>
		<Field label="Photo views taken" inputId="photoViewsTaken">
			<TextInput id="photoViewsTaken" label="Photo views taken" bind:value={d.photoViewsTaken} />
		</Field>
		<Field label="Standardised views used?">
			<RadioGroup label="Standardised views used?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="standardisedViews" value={opt.value} bind:group={d.standardisedViews} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Measurements recorded?">
		<RadioGroup label="Measurements recorded?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="measurementsRecorded" value={opt.value} bind:group={d.measurementsRecorded} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.measurementsRecorded === 'yes'}
		<Field label="Measurement details" inputId="measurementDetails">
			<TextInput id="measurementDetails" label="Measurement details" bind:value={d.measurementDetails} />
		</Field>
	{/if}

	<Field label="Diagrams drawn?">
		<RadioGroup label="Diagrams drawn?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diagramsDrawn" value={opt.value} bind:group={d.diagramsDrawn} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.diagramsDrawn === 'yes'}
		<Field label="Diagram notes" inputId="diagramNotes">
			<TextInput id="diagramNotes" label="Diagram notes" bind:value={d.diagramNotes} />
		</Field>
	{/if}

	<Field label="Previous imaging?">
		<RadioGroup label="Previous imaging?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousImaging" value={opt.value} bind:group={d.previousImaging} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.previousImaging === 'yes'}
		<Field label="Previous imaging type" inputId="previousImagingType">
			<Select id="previousImagingType" label="Previous imaging type" bind:value={d.previousImagingType}>
				<option value="">Select…</option>
				<option value="ct">CT</option>
				<option value="mri">MRI</option>
				<option value="ultrasound">Ultrasound</option>
				<option value="x-ray">X-ray</option>
				<option value="angiography">Angiography</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Previous imaging findings" inputId="previousImagingFindings">
			<TextAreaInput id="previousImagingFindings" label="Previous imaging findings" rows={2} bind:value={d.previousImagingFindings} />
		</Field>
	{/if}
</Fieldset>
