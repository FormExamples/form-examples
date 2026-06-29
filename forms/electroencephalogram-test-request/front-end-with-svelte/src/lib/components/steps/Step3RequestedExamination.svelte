<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">The requested EEG study, the primary indication, and the specific clinical question.</p>

	<Field label="Requested EEG type" inputId="eegType" required>
		<Select id="eegType" label="Requested EEG type" bind:value={d.eegType} required>
			<option value="">Select…</option>
			<option value="routine-awake">Routine awake</option>
			<option value="sleep-deprived">Sleep-deprived</option>
			<option value="ambulatory-24h">Ambulatory 24-hour</option>
			<option value="video-telemetry">Video-telemetry</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="suspected-epilepsy">Suspected epilepsy</option>
			<option value="seizure-classification">Seizure classification</option>
			<option value="status-epilepticus">Status epilepticus</option>
			<option value="encephalopathy">Encephalopathy</option>
			<option value="first-seizure">First seizure</option>
			<option value="funny-turns">Funny turns</option>
			<option value="dementia">Dementia</option>
			<option value="pre-surgical-evaluation">Pre-surgical evaluation</option>
			<option value="medication-review">Medication review</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the EEG is asked to answer…"
			bind:value={d.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant clinical history and context for the request…"
			bind:value={d.relevantHistory}
		/>
	</Field>
</Fieldset>
