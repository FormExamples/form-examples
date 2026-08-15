<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Impression & Structured Reporting">
	<p class="hint">The summary impression, the structured-reporting category, and recommended follow-up.</p>

	<Field label="Impression" inputId="impression" required>
		<TextAreaInput
			id="impression"
			label="Impression"
			rows={4}
			placeholder="Summary impression / conclusion answering the clinical question…"
			bind:value={d.impression}
		/>
	</Field>

	<Field
		label="Reporting category"
		inputId="reportingCategory"
		description="Structured-reporting label, e.g. a Deauville score 1-5 (lymphoma) or a PERCIST response category (solid tumours)."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. Deauville 4 or PERCIST PMR"
			bind:value={d.reportingCategory}
		/>
	</Field>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Recommended follow-up imaging, referral, or management…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
