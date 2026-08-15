<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Tumour & Complication">
	<p class="hint">Tumour / lesion detail and any procedure complication.</p>

	<Field
		label="Tumour size (mm)"
		inputId="tumourSizeMm"
		description="Largest tumour / lesion size, for categorisation and surveillance."
	>
		<NumberInput
			id="tumourSizeMm"
			label="Tumour size (mm)"
			min={0}
			max={500}
			step={0.1}
			bind:value={d.tumourSizeMm}
		/>
	</Field>

	<Field label="Tumour appearance" inputId="tumourAppearance">
		<Select id="tumourAppearance" label="Tumour appearance" bind:value={d.tumourAppearance}>
			<option value="">Select…</option>
			<option value="papillary">Papillary</option>
			<option value="solid">Solid</option>
			<option value="flat">Flat</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Biopsy taken">
		<CheckboxGroup label="Biopsy taken">
			<label>
				<CheckboxInput label="A biopsy / sample was taken" bind:checked={d.biopsyTaken} /> A biopsy /
				sample was taken
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Complication" inputId="complication">
		<Select id="complication" label="Complication" bind:value={d.complication}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="bleeding">Bleeding</option>
			<option value="perforation">Perforation</option>
			<option value="uti">UTI</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
