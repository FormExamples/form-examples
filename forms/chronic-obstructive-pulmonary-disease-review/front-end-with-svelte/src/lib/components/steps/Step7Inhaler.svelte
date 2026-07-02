<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const i = assessment.data.inhaler;
</script>

<Fieldset legend="Step 7 of 11 — Inhaler therapy">
	<p class="hint">Current regimen, device, technique check, and adherence.</p>

	<Field label="Current inhaled therapy" inputId="inhaler-inhaledTherapy">
		<TextAreaInput
			id="inhaler-inhaledTherapy"
			label="Current inhaled therapy"
			rows={2}
			placeholder="e.g. LABA+LAMA (tiotropium/olodaterol), plus SABA (salbutamol) PRN."
			bind:value={i.inhaledTherapy}
		/>
	</Field>

	<Field label="Device type(s)" inputId="inhaler-deviceType">
		<TextInput
			id="inhaler-deviceType"
			label="Device type(s)"
			placeholder="e.g. Respimat soft-mist, DPI, pMDI + spacer"
			bind:value={i.deviceType}
		/>
	</Field>

	<Field label="Inhaler technique checked this review?" inputId="inhaler-inhalerTechniqueChecked">
		<Select
			id="inhaler-inhalerTechniqueChecked"
			label="Inhaler technique checked this review"
			bind:value={i.inhalerTechniqueChecked}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Inhaler technique adequate?" inputId="inhaler-inhalerTechniqueAdequate">
		<Select
			id="inhaler-inhalerTechniqueAdequate"
			label="Inhaler technique adequate"
			bind:value={i.inhalerTechniqueAdequate}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Self-reported adherence" inputId="inhaler-adherence">
		<Select id="inhaler-adherence" label="Self-reported adherence" bind:value={i.adherence}>
			<option value="">— Select —</option>
			<option value="good">Good</option>
			<option value="partial">Partial</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>
</Fieldset>
