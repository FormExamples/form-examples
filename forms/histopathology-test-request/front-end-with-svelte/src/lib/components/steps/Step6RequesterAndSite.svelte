<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/result.svelte.js';

	const clinician = request.data.clinician;
	const triage = request.data.triage;
</script>

<Fieldset legend="6. Requester and Site">
	<p class="hint">Submitting site, care setting, requested-by date, and any notes.</p>

	<Field label="Site name" inputId="siteName">
		<TextInput
			id="siteName"
			label="Site name"
			placeholder="e.g. Headington Endoscopy Unit"
			bind:value={clinician.siteName}
		/>
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={triage.setting}>
			<option value="">Select…</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="community">Community</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={triage.requestedByDate} />
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes accompanying the request…"
			bind:value={triage.notes}
		/>
	</Field>
</Fieldset>
