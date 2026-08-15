<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="7. Triage">
	<p class="hint">Requested urgency, setting, and notes. Red flags can escalate the computed tier.</p>

	<Field label="Requested urgency" inputId="urgency" required>
		<Select id="urgency" label="Requested urgency" bind:value={d.triage.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.triage.requestedByDate} />
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={d.triage.setting}>
			<option value="">Select…</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="community">Community</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput id="notes" label="Notes" rows={3} placeholder="Free-text notes accompanying the request…" bind:value={d.triage.notes} />
	</Field>
</Fieldset>
