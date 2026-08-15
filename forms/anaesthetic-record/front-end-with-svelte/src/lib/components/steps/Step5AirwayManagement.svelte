<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const a = assessment.data.airway;

	// Cormack-Lehane grade is numeric; bridge the string-valued <select>.
	let cormack = $state(a.cormackLehaneGrade === null ? '' : String(a.cormackLehaneGrade));
	$effect(() => {
		a.cormackLehaneGrade = cormack === '' ? null : Number(cormack);
	});
</script>

<Fieldset legend="Step 5 of 12 — Airway management">
	<p class="hint">Technique, device, view, attempts, and confirmation.</p>

	<Field label="Airway-management technique" required inputId="airway-airwayTechnique">
		<Select id="airway-airwayTechnique" label="Airway-management technique" required bind:value={a.airwayTechnique}>
			<option value="">— Select —</option>
			<option value="facemask">Facemask</option>
			<option value="supraglottic">Supraglottic airway</option>
			<option value="tracheal-tube">Tracheal tube</option>
			<option value="tracheostomy">Tracheostomy</option>
			<option value="awake-foi">Awake fibreoptic intubation</option>
		</Select>
	</Field>

	<Field label="Device / tube size" inputId="airway-deviceSize">
		<TextInput id="airway-deviceSize" label="Device / tube size" placeholder="e.g. Size 4 LMA, 7.5 ETT" bind:value={a.deviceSize} />
	</Field>

	<Field label="Tube depth at teeth (cm)" inputId="airway-tubeDepthCm">
		<NumberInput id="airway-tubeDepthCm" label="Tube depth at teeth (cm)" min={0} step="any" bind:value={a.tubeDepthCm} />
	</Field>

	<Field label="Cuffed device?" inputId="airway-cuffed">
		<Select id="airway-cuffed" label="Cuffed device?" bind:value={a.cuffed}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Cormack–Lehane grade of view"
		description="Grade III–IV raises a difficult-airway safety flag."
		inputId="airway-cormackLehaneGrade"
	>
		<Select id="airway-cormackLehaneGrade" label="Cormack–Lehane grade of view" bind:value={cormack}>
			<option value="">— Select —</option>
			<option value="1">1</option>
			<option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
		</Select>
	</Field>

	<Field
		label="Number of intubation attempts"
		description="Three or more attempts raises a difficult-airway safety flag."
		inputId="airway-intubationAttempts"
	>
		<NumberInput id="airway-intubationAttempts" label="Number of intubation attempts" min={0} step={1} bind:value={a.intubationAttempts} />
	</Field>

	<Field label="Placement confirmed by capnography?" inputId="airway-capnographyConfirmed">
		<Select id="airway-capnographyConfirmed" label="Placement confirmed by capnography?" bind:value={a.capnographyConfirmed}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
