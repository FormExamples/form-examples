<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Dipstick (reagent strip)">
	<p class="hint">Semi-quantitative reagent-strip results.</p>

	<Field label="Leucocytes" inputId="leucocytes">
		<Select id="leucocytes" label="Leucocytes" bind:value={d.leucocytes}>
			<option value="">Select…</option>
			<option value="negative">Negative</option>
			<option value="trace">Trace</option>
			<option value="plus-one">1+</option>
			<option value="plus-two">2+</option>
			<option value="plus-three">3+</option>
		</Select>
	</Field>

	<Field label="Nitrites" inputId="nitrites">
		<Select id="nitrites" label="Nitrites" bind:value={d.nitrites}>
			<option value="">Select…</option>
			<option value="negative">Negative</option>
			<option value="positive">Positive</option>
		</Select>
	</Field>

	<Field label="Protein" inputId="protein">
		<Select id="protein" label="Protein" bind:value={d.protein}>
			<option value="">Select…</option>
			<option value="negative">Negative</option>
			<option value="trace">Trace</option>
			<option value="plus-one">1+</option>
			<option value="plus-two">2+</option>
			<option value="plus-three">3+</option>
		</Select>
	</Field>

	<Field label="Blood" inputId="blood">
		<Select id="blood" label="Blood" bind:value={d.blood}>
			<option value="">Select…</option>
			<option value="negative">Negative</option>
			<option value="trace">Trace</option>
			<option value="plus-one">1+</option>
			<option value="plus-two">2+</option>
			<option value="plus-three">3+</option>
		</Select>
	</Field>

	<Field label="Glucose" inputId="glucose">
		<Select id="glucose" label="Glucose" bind:value={d.glucose}>
			<option value="">Select…</option>
			<option value="negative">Negative</option>
			<option value="trace">Trace</option>
			<option value="plus-one">1+</option>
			<option value="plus-two">2+</option>
			<option value="plus-three">3+</option>
		</Select>
	</Field>

	<Field label="Ketones" inputId="ketones">
		<Select id="ketones" label="Ketones" bind:value={d.ketones}>
			<option value="">Select…</option>
			<option value="negative">Negative</option>
			<option value="trace">Trace</option>
			<option value="plus-one">1+</option>
			<option value="plus-two">2+</option>
			<option value="plus-three">3+</option>
		</Select>
	</Field>

	<Field label="Bilirubin" inputId="bilirubin">
		<Select id="bilirubin" label="Bilirubin" bind:value={d.bilirubin}>
			<option value="">Select…</option>
			<option value="negative">Negative</option>
			<option value="trace">Trace</option>
			<option value="plus-one">1+</option>
			<option value="plus-two">2+</option>
			<option value="plus-three">3+</option>
		</Select>
	</Field>

	<Field label="pH" inputId="ph" description="Urine pH (approximately 4.0–9.0).">
		<NumberInput id="ph" label="pH" min={4} max={9} step={0.1} bind:value={d.ph} />
	</Field>

	<Field
		label="Specific gravity"
		inputId="specificGravity"
		description="Urine specific gravity (approximately 1.000–1.060)."
	>
		<NumberInput
			id="specificGravity"
			label="Specific gravity"
			min={1}
			max={1.06}
			step={0.001}
			bind:value={d.specificGravity}
		/>
	</Field>
</Fieldset>
