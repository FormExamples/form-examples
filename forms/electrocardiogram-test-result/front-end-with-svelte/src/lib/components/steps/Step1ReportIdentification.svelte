<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="1. Report Identification">
	<p class="hint">Who authored the report, the originating request, the ECG type, and key dates.</p>

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
			placeholder="e.g. REQ-2001"
			bind:value={d.originatingRequestReference}
		/>
	</Field>

	<Field label="ECG type" inputId="ecgType" required>
		<Select id="ecgType" label="ECG type" bind:value={d.ecgType} required>
			<option value="">Select…</option>
			<option value="resting-12-lead">Resting 12-lead</option>
			<option value="exercise-stress">Exercise / stress</option>
			<option value="ambulatory-holter-24h">Ambulatory Holter 24h</option>
			<option value="ambulatory-48h">Ambulatory 48h</option>
			<option value="event-recorder">Event recorder</option>
			<option value="other">Other</option>
		</Select>
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

	<Field label="Recording quality" inputId="recordingQuality">
		<Select id="recordingQuality" label="Recording quality" bind:value={d.recordingQuality}>
			<option value="">Select…</option>
			<option value="good">Good</option>
			<option value="adequate">Adequate</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<Field label="Performed date" inputId="performedDate">
		<DateInput id="performedDate" label="Performed date" bind:value={d.performedDate} />
	</Field>

	<Field label="Reported date" inputId="reportedDate">
		<DateInput id="reportedDate" label="Reported date" bind:value={d.reportedDate} />
	</Field>
</Fieldset>
