<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const r = request.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">The requested monitor, the primary indication, and the specific clinical question.</p>

	<Field label="Monitor type" inputId="monitorType" required>
		<Select id="monitorType" label="Monitor type" bind:value={r.monitorType} required>
			<option value="">Select…</option>
			<option value="24-hour">24-hour Holter</option>
			<option value="48-hour">48-hour Holter</option>
			<option value="7-day">7-day monitor</option>
			<option value="14-day">14-day monitor</option>
			<option value="event-recorder">Event recorder</option>
			<option value="implantable-loop-recorder">Implantable loop recorder</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={r.primaryIndication} required>
			<option value="">Select…</option>
			<option value="palpitations">Palpitations</option>
			<option value="suspected-arrhythmia">Suspected arrhythmia</option>
			<option value="syncope">Syncope</option>
			<option value="atrial-fibrillation-detection">Atrial-fibrillation detection</option>
			<option value="post-stroke-af-screen">Post-stroke AF screen</option>
			<option value="rate-control-assessment">Rate-control assessment</option>
			<option value="qt-monitoring">QT monitoring</option>
			<option value="pacemaker-check">Pacemaker check</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the monitoring should answer…"
			bind:value={r.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant clinical history and context for the request…"
			bind:value={r.relevantHistory}
		/>
	</Field>
</Fieldset>
