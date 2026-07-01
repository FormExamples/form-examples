<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="1. Response Identification">
	<p class="hint">Who authored the reply, the originating referral, and key dates.</p>

	<Field label="Responding clinician" inputId="respondingClinician" required>
		<TextInput
			id="respondingClinician"
			label="Responding clinician"
			placeholder="e.g. Dr A Cardiologist"
			bind:value={d.respondingClinician}
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

	<Field label="Response status" inputId="responseStatus" required>
		<Select id="responseStatus" label="Response status" bind:value={d.responseStatus} required>
			<option value="">Select…</option>
			<option value="preliminary">Preliminary</option>
			<option value="final">Final</option>
			<option value="amended">Amended</option>
			<option value="cancelled">Cancelled</option>
		</Select>
	</Field>

	<Field label="Consultation type" inputId="consultationType">
		<Select id="consultationType" label="Consultation type" bind:value={d.consultationType}>
			<option value="">Select…</option>
			<option value="clinic-review">Clinic review</option>
			<option value="advice-and-guidance">Advice and guidance</option>
			<option value="telephone">Telephone</option>
			<option value="inpatient-review">Inpatient review</option>
			<option value="virtual">Virtual</option>
		</Select>
	</Field>

	<Field label="Assessed date" inputId="assessedDate">
		<DateInput id="assessedDate" label="Assessed date" bind:value={d.assessedDate} />
	</Field>

	<Field label="Responded date" inputId="respondedDate">
		<DateInput id="respondedDate" label="Responded date" bind:value={d.respondedDate} />
	</Field>
</Fieldset>
