<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="1. Report Identification">
	<p class="hint">Who authored the report, the originating request, the monitor type, and key dates.</p>

	<Field label="Reporting clinician" inputId="reportingClinician" required>
		<TextInput
			id="reportingClinician"
			label="Reporting clinician"
			placeholder="e.g. Dr A Cardiologist"
			bind:value={d.reportingClinician}
			required
		/>
	</Field>

	<Field label="Originating request reference" inputId="originatingRequestReference">
		<TextInput
			id="originatingRequestReference"
			label="Originating request reference"
			placeholder="e.g. REQ-1001"
			bind:value={d.originatingRequestReference}
		/>
	</Field>

	<Field label="Report status" inputId="reportStatus" required>
		<Select id="reportStatus" label="Report status" bind:value={d.reportStatus} required>
			<option value="">Select…</option>
			<option value="preliminary">Preliminary</option>
			<option value="final">Final</option>
			<option value="amended">Amended</option>
			<option value="cancelled">Cancelled</option>
		</Select>
	</Field>

	<Field label="Monitor type" inputId="monitorType" required>
		<Select id="monitorType" label="Monitor type" bind:value={d.monitorType} required>
			<option value="">Select…</option>
			<option value="24-hour">24-hour</option>
			<option value="48-hour">48-hour</option>
			<option value="7-day">7-day</option>
			<option value="14-day">14-day</option>
			<option value="event-recorder">Event recorder</option>
			<option value="implantable-loop-recorder">Implantable loop recorder</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Performed date" inputId="performedDate">
		<DateInput id="performedDate" label="Performed date" bind:value={d.performedDate} />
	</Field>

	<Field label="Reported date" inputId="reportedDate">
		<DateInput id="reportedDate" label="Reported date" bind:value={d.reportedDate} />
	</Field>
</Fieldset>
