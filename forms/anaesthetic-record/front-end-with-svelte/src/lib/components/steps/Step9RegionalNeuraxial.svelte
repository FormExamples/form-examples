<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const r = $state(assessment.data.regional);
</script>

<Fieldset legend="Step 9 of 12 — Regional / neuraxial">
	<p class="hint">Any regional or neuraxial technique used.</p>

	<Field label="Regional technique" inputId="regional-regionalTechnique">
		<Select id="regional-regionalTechnique" label="Regional technique" bind:value={r.regionalTechnique}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="spinal">Spinal</option>
			<option value="epidural">Epidural</option>
			<option value="cse">Combined spinal-epidural</option>
			<option value="peripheral-block">Peripheral nerve block</option>
		</Select>
	</Field>

	<Field label="Interspace / target level" inputId="regional-regionalLevel">
		<TextInput id="regional-regionalLevel" label="Interspace / target level" placeholder="e.g. L3/4" bind:value={r.regionalLevel} />
	</Field>

	<Field label="Agent" inputId="regional-regionalDrug">
		<TextInput id="regional-regionalDrug" label="Agent" placeholder="e.g. Bupivacaine 0.5% heavy" bind:value={r.regionalDrug} />
	</Field>

	<Field label="Dose (mg)" inputId="regional-regionalDoseMg">
		<NumberInput id="regional-regionalDoseMg" label="Dose (mg)" min={0} step="any" bind:value={r.regionalDoseMg} />
	</Field>

	<Field label="Achieved block height / effect" inputId="regional-blockHeight">
		<TextInput id="regional-blockHeight" label="Achieved block height / effect" placeholder="e.g. T6 bilateral" bind:value={r.blockHeight} />
	</Field>

	<Field label="Complications" inputId="regional-regionalComplications">
		<TextAreaInput id="regional-regionalComplications" label="Complications" rows={3} placeholder="e.g. None; single clean pass" bind:value={r.regionalComplications} />
	</Field>
</Fieldset>
