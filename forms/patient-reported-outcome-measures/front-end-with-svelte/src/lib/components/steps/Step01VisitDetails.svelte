<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const v = assessment.data.visitDetails;
</script>

<Fieldset legend="Step 1 of 9 — Visit details">
	<p class="hint">
		One patient, at one visit/time point. SF-36v2, NDI, and EQ-5D are usually completed by the
		patient directly; mJOA is typically completed by the assessing clinician.
	</p>

	<Field label="Subject ID" required inputId="visitDetails-subjectId">
		<TextInput
			id="visitDetails-subjectId"
			label="Subject ID"
			placeholder="e.g. SUBJ-1042"
			required
			bind:value={v.subjectId}
		/>
	</Field>

	<Field
		label="Visit"
		description="e.g. Baseline, 6-week, 3-month, 1-year"
		required
		inputId="visitDetails-visit"
	>
		<TextInput
			id="visitDetails-visit"
			label="Visit"
			placeholder="e.g. Baseline"
			required
			bind:value={v.visit}
		/>
	</Field>

	<Field label="Assessment date" required inputId="visitDetails-assessmentDate">
		<DateInput
			id="visitDetails-assessmentDate"
			label="Assessment date"
			required
			bind:value={v.assessmentDate}
		/>
	</Field>
</Fieldset>
