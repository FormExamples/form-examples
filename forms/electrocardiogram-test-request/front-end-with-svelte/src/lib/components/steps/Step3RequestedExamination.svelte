<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">The requested ECG type, the primary indication, and the specific clinical question.</p>

	<Field label="ECG type" inputId="ecgType" required description="The recommended type depends on the indication (AHA/ACC ECG-use guidance).">
		<Select id="ecgType" label="ECG type" bind:value={d.ecgType} required>
			<option value="">Select…</option>
			<option value="resting-12-lead">Resting 12-lead</option>
			<option value="exercise-stress">Exercise stress</option>
			<option value="ambulatory-holter-24h">Ambulatory Holter 24h</option>
			<option value="ambulatory-48h">Ambulatory 48h</option>
			<option value="event-recorder">Event recorder</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="chest-pain">Chest pain</option>
			<option value="palpitations">Palpitations</option>
			<option value="syncope">Syncope</option>
			<option value="suspected-arrhythmia">Suspected arrhythmia</option>
			<option value="suspected-mi-acs">Suspected MI / ACS</option>
			<option value="pre-operative">Pre-operative</option>
			<option value="medication-monitoring-qt">Medication monitoring (QT)</option>
			<option value="hypertension">Hypertension</option>
			<option value="heart-failure">Heart failure</option>
			<option value="screening">Screening</option>
			<option value="follow-up">Follow-up</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required description="The specific question the ECG should answer.">
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="e.g. Is there evidence of ischaemia? Please risk-stratify."
			bind:value={d.clinicalQuestion}
			required
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant cardiac history, prior ECGs, and context…"
			bind:value={d.relevantHistory}
		/>
	</Field>
</Fieldset>
