<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { requestStore } from '#lib/stores/request.svelte.js';

	const d = requestStore.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">
		Exam type, indication, laterality, and the specific clinical question — the highest-value
		fields, which drive the appropriateness and completeness axes.
	</p>

	<Field label="Exam type" inputId="examType" required>
		<Select id="examType" label="Exam type" bind:value={d.examType} required>
			<option value="">Select…</option>
			<option value="screening">Screening</option>
			<option value="diagnostic">Diagnostic</option>
			<option value="symptomatic">Symptomatic</option>
			<option value="surveillance">Surveillance</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="routine-screening">Routine screening</option>
			<option value="breast-lump">Breast lump</option>
			<option value="breast-pain">Breast pain</option>
			<option value="nipple-discharge">Nipple discharge</option>
			<option value="skin-change">Skin change</option>
			<option value="family-history">Family history</option>
			<option value="follow-up-known-cancer">Follow-up known cancer</option>
			<option value="post-treatment-surveillance">Post-treatment surveillance</option>
			<option value="recall-from-screening">Recall from screening</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Laterality" inputId="laterality">
		<Select id="laterality" label="Laterality" bind:value={d.laterality}>
			<option value="">Select…</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="bilateral">Bilateral</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			placeholder="e.g. Characterise palpable lump in the left upper outer quadrant."
			bind:value={d.clinicalQuestion}
			required
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput id="relevantHistory" label="Relevant history" rows={2} bind:value={d.relevantHistory} />
	</Field>
</Fieldset>
