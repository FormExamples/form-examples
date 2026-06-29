<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.triage;
</script>

<Fieldset legend="6. Procedure Detail and Triage">
	<p class="hint">Opening-pressure requirement, requested urgency, setting, and any notes.</p>

	<Field label="Opening pressure (manometry)">
		<CheckboxGroup label="Opening pressure (manometry)">
			<label><CheckboxInput label="Opening-pressure measurement required" bind:checked={d.openingPressureRequired} /> Opening-pressure measurement required</label>
		</CheckboxGroup>
	</Field>

	<Field label="Requested urgency" inputId="urgency" required>
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.requestedByDate} />
	</Field>

	<Field label="Setting" inputId="setting">
		<Select id="setting" label="Setting" bind:value={d.setting}>
			<option value="">Select…</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="day-case">Day case</option>
			<option value="emergency">Emergency department</option>
			<option value="community">Community</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Any additional information for the vetting team…"
			bind:value={d.notes}
		/>
	</Field>
</Fieldset>
