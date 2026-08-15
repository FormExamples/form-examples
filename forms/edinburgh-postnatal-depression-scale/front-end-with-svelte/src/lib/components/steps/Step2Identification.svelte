<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 6 — Respondent identification">
	<p class="hint">Local identifier and the respondent's completion details.</p>

	<Field label="Respondent identifier" required inputId="identification-respondentIdentifier">
		<TextInput
			id="identification-respondentIdentifier"
			label="Respondent identifier"
			placeholder="e.g. MAT-100482"
			required
			bind:value={i.respondentIdentifier}
		/>
	</Field>

	<Field label="Age band" inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" bind:value={i.ageBand}>
			<option value="">— Select —</option>
			<option value="under-20">Under 20</option>
			<option value="20-29">20-29</option>
			<option value="30-39">30-39</option>
			<option value="40-plus">40 and over</option>
		</Select>
	</Field>

	<Field
		label="Preferred language"
		description="The language the EPDS was completed in."
		inputId="identification-preferredLanguage"
	>
		<TextInput
			id="identification-preferredLanguage"
			label="Preferred language"
			placeholder="e.g. English"
			bind:value={i.preferredLanguage}
		/>
	</Field>

	<Field label="Assistance needed to complete" inputId="identification-assistanceNeeded">
		<Select
			id="identification-assistanceNeeded"
			label="Assistance needed to complete"
			bind:value={i.assistanceNeeded}
		>
			<option value="">— Select —</option>
			<option value="none">None — self-completed</option>
			<option value="interpreter">Interpreter</option>
			<option value="clinician-read">Clinician read the items aloud</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
