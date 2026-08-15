<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 1 of 6 — Patient and assessment identification">
	<p class="hint">
		Who is being assessed, when, where, and by whom. The 4AT is for adults, most commonly aged 65
		and over.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. MRN-100482 or hospital number"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field label="Patient name" inputId="identification-patientName">
		<TextInput
			id="identification-patientName"
			label="Patient name"
			placeholder="e.g. Surname, Forename"
			bind:value={p.patientName}
		/>
	</Field>

	<Field label="Date of birth" inputId="identification-dateOfBirth">
		<DateInput
			id="identification-dateOfBirth"
			label="Date of birth"
			bind:value={() => p.dateOfBirth ?? '', (v) => (p.dateOfBirth = v === '' ? null : v)}
		/>
	</Field>

	<Field label="Assessment date" inputId="identification-assessmentDate">
		<DateInput
			id="identification-assessmentDate"
			label="Assessment date"
			bind:value={() => p.assessmentDate ?? '', (v) => (p.assessmentDate = v === '' ? null : v)}
		/>
	</Field>

	<Field label="Assessment time" inputId="identification-assessmentTime">
		<TextInput
			id="identification-assessmentTime"
			label="Assessment time"
			type="time"
			class="date-input"
			bind:value={() => p.assessmentTime ?? '', (v) => (p.assessmentTime = v === '' ? null : v)}
		/>
	</Field>

	<Field label="Setting" required inputId="identification-setting">
		<Select id="identification-setting" label="Setting" required bind:value={p.setting}>
			<option value="">— Select —</option>
			<option value="acute">Acute medical admission</option>
			<option value="ed">Emergency department</option>
			<option value="periop">Peri-operative / post-operative</option>
			<option value="careHome">Care home</option>
			<option value="community">Community</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Assessor name" inputId="identification-assessorName">
		<TextInput
			id="identification-assessorName"
			label="Assessor name"
			placeholder="e.g. Dr A. Khan"
			bind:value={p.assessorName}
		/>
	</Field>

	<Field label="Assessor role" inputId="identification-assessorRole">
		<TextInput
			id="identification-assessorRole"
			label="Assessor role"
			placeholder="e.g. Registrar, Staff nurse"
			bind:value={p.assessorRole}
		/>
	</Field>
</Fieldset>
