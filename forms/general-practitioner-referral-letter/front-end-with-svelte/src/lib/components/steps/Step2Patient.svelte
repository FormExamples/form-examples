<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const p = assessment.data.patient;
</script>

<Fieldset legend="Step 2 of 9 — Patient identification">
	<p class="hint">Who is being referred, so the receiving service can identify the patient.</p>

	<Field label="NHS number or local identifier" required inputId="patient-patientIdentifier">
		<TextInput
			id="patient-patientIdentifier"
			label="NHS number or local identifier"
			placeholder="e.g. 943 476 5919"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field label="Patient name" required inputId="patient-patientName">
		<TextInput
			id="patient-patientName"
			label="Patient name"
			placeholder="e.g. James Okoro"
			required
			bind:value={p.patientName}
		/>
	</Field>

	<Field label="Date of birth" required inputId="patient-patientDateOfBirth">
		<DateInput
			id="patient-patientDateOfBirth"
			label="Date of birth"
			required
			bind:value={p.patientDateOfBirth}
		/>
	</Field>

	<Field label="Sex" inputId="patient-patientSex">
		<Select id="patient-patientSex" label="Sex" bind:value={p.patientSex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="other">Other</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Home address" inputId="patient-patientAddress">
		<TextAreaInput
			id="patient-patientAddress"
			label="Home address"
			rows={2}
			placeholder="Where the patient normally lives"
			bind:value={p.patientAddress}
		/>
	</Field>

	<Field label="Contact (phone or email)" inputId="patient-patientContact">
		<TextInput
			id="patient-patientContact"
			label="Contact (phone or email)"
			placeholder="e.g. 07700 900123"
			bind:value={p.patientContact}
		/>
	</Field>

	<Field label="Interpreter or accessibility needs" inputId="patient-accessNeeds">
		<TextInput
			id="patient-accessNeeds"
			label="Interpreter or accessibility needs"
			placeholder="e.g. British Sign Language interpreter required"
			bind:value={p.accessNeeds}
		/>
	</Field>
</Fieldset>
