<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = request.data.lesion;
</script>

<Fieldset legend="Lesion description">
	<p class="hint">Target lesion size, location, and any imaging correlate or previous finding.</p>

	<Field label="Lesion description" inputId="lesionDescription">
		<TextAreaInput
			id="lesionDescription"
			label="Lesion description"
			rows={2}
			placeholder="e.g. 18 mm hypoechoic nodule, upper outer quadrant left breast."
			bind:value={d.lesionDescription}
		/>
	</Field>

	<div class="field-grid">
		<Field label="Lesion size (mm)" inputId="lesionSize">
			<NumberInput id="lesionSize" label="Lesion size" min={0} max={500} step={0.1} bind:value={d.lesionSize} />
		</Field>
		<Field label="Lesion location" inputId="lesionLocation">
			<TextInput id="lesionLocation" label="Lesion location" bind:value={d.lesionLocation} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Imaging correlate" inputId="imagingCorrelate">
			<Select id="imagingCorrelate" label="Imaging correlate" bind:value={d.imagingCorrelate}>
				<option value="">— Select —</option>
				<option value="ultrasound">Ultrasound</option>
				<option value="ct">CT</option>
				<option value="mri">MRI</option>
				<option value="pet">PET</option>
				<option value="mammography">Mammography</option>
				<option value="none">None</option>
			</Select>
		</Field>
		<Field label="Previous finding" inputId="previousFinding">
			<TextInput id="previousFinding" label="Previous finding" bind:value={d.previousFinding} />
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
