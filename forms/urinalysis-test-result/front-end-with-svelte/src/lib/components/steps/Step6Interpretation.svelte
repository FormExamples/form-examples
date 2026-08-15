<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Interpretation">
	<p class="hint">The overall result status, narrative, impression, and follow-up.</p>

	<Field label="Overall result status" inputId="overallResultStatus">
		<Select id="overallResultStatus" label="Overall result status" bind:value={d.overallResultStatus}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="critical">Critical</option>
		</Select>
	</Field>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the urinalysis findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Impression" inputId="impression" required>
		<TextAreaInput
			id="impression"
			label="Impression"
			rows={4}
			placeholder="Summary impression / conclusion answering the clinical question…"
			bind:value={d.impression}
		/>
	</Field>

	<Field label="Reporting category" inputId="reportingCategory">
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. significant E. coli bacteriuria"
			bind:value={d.reportingCategory}
		/>
	</Field>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Recommended follow-up testing, referral, or management…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
