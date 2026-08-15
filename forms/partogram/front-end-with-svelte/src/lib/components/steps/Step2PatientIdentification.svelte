<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.patient;
</script>

<Fieldset legend="Step 2 of 5 — Patient identification">
	<p class="hint">Minimal identification for the labour record.</p>

	<Field label="Patient identifier" required inputId="patient-patientIdentifier">
		<TextInput
			id="patient-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. local ID or bed number"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" inputId="patient-ageBand">
		<Select id="patient-ageBand" label="Age band" bind:value={p.ageBand}>
			<option value="">— Select —</option>
			<option value="under-18">Under 18</option>
			<option value="18-24">18-24</option>
			<option value="25-34">25-34</option>
			<option value="35-39">35-39</option>
			<option value="40-plus">40+</option>
		</Select>
	</Field>

	<Field label="Parity" inputId="patient-parity">
		<Select id="patient-parity" label="Parity" bind:value={p.parity}>
			<option value="">— Select —</option>
			<option value="nulliparous">Nulliparous</option>
			<option value="multiparous">Multiparous</option>
		</Select>
	</Field>

	<Field label="Gestation (weeks)" inputId="patient-gestationWeeks">
		<NumberInput
			id="patient-gestationWeeks"
			label="Gestation (weeks)"
			min={20}
			max={45}
			step={1}
			bind:value={p.gestationWeeks}
		/>
	</Field>
</Fieldset>
