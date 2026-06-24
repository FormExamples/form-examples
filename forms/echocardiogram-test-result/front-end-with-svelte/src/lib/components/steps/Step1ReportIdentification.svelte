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
	<p class="hint">Who authored the report, the study type and quality, and key dates.</p>

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

	<Field label="Echo type" inputId="echoType" required>
		<Select id="echoType" label="Echo type" bind:value={d.echoType} required>
			<option value="">Select…</option>
			<option value="transthoracic-tte">Transthoracic (TTE)</option>
			<option value="transoesophageal-toe">Transoesophageal (TOE)</option>
			<option value="stress-echo">Stress echo</option>
			<option value="contrast-echo">Contrast echo</option>
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

	<Field label="Study quality" inputId="studyQuality">
		<Select id="studyQuality" label="Study quality" bind:value={d.studyQuality}>
			<option value="">Select…</option>
			<option value="good">Good</option>
			<option value="adequate">Adequate</option>
			<option value="limited">Limited</option>
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
