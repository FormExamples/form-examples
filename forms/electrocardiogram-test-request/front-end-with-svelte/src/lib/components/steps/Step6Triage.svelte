<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.triage;
</script>

<Fieldset legend="6. Triage">
	<p class="hint">The requested urgency, the requested-by date, and the care setting.</p>

	<Field label="Requested urgency" inputId="urgency" required description="The engine may escalate this if a red flag is present, but will not lower it.">
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate" description="Date by which the ECG should be performed.">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.requestedByDate} />
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={d.setting}>
			<option value="">Select…</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="community">Community</option>
			<option value="emergency">Emergency department</option>
			<option value="pre-operative">Pre-operative clinic</option>
		</Select>
	</Field>

	<Field label="Requesting site / ward" inputId="triageSiteName">
		<TextInput
			id="triageSiteName"
			label="Requesting site / ward"
			placeholder="e.g. Cardiac Physiology, City General"
			bind:value={d.siteName}
		/>
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes accompanying the request…"
			bind:value={d.notes}
		/>
	</Field>
</Fieldset>
