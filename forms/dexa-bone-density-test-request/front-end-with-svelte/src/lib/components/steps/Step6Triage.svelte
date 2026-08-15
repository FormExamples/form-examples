<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import { requestStore } from '#lib/stores/result.svelte.js';

	const d = requestStore.data;
</script>

<Fieldset legend="6. Triage and Submit">
	<p class="hint">The requested urgency, the requested-by date, and the care setting.</p>

	<Field
		label="Requested urgency"
		inputId="urgency"
		description="The engine may escalate this if a high-acuity factor is present, but will not lower it."
	>
		<Select id="urgency" label="Requested urgency" bind:value={d.triage.urgency}>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
		</Select>
	</Field>

	<Field
		label="Requested-by date"
		inputId="requestedByDate"
		description="Date by which the scan should be performed."
	>
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
</Fieldset>
