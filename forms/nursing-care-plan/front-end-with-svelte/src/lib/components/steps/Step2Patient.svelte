<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.patient;
</script>

<Fieldset legend="Step 2 of 8 — Patient identification">
	<p class="hint">Identify the patient or resident this plan of care is for.</p>

	<Field label="Patient identifier" required inputId="patient-patientIdentifier">
		<TextInput
			id="patient-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. MRN-448210"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field label="Patient name" inputId="patient-patientName">
		<TextInput
			id="patient-patientName"
			label="Patient name"
			placeholder="e.g. Beatrice Okafor"
			bind:value={p.patientName}
		/>
	</Field>

	<Field label="Date of birth" inputId="patient-dateOfBirth">
		<TextInput
			id="patient-dateOfBirth"
			label="Date of birth"
			type="date"
			class="date-input"
			bind:value={p.dateOfBirth}
		/>
	</Field>

	<Field label="Sex" inputId="patient-sex">
		<Select id="patient-sex" label="Sex" bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Ward / location" inputId="patient-wardLocation">
		<TextInput
			id="patient-wardLocation"
			label="Ward / location"
			placeholder="e.g. Ward 12, Bay 3"
			bind:value={p.wardLocation}
		/>
	</Field>
</Fieldset>
