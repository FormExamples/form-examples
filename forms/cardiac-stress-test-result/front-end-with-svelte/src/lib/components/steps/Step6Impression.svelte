<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Impression">
	<p class="hint">The summary impression, risk category, and recommended follow-up.</p>

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
		description="Structured risk-category label (e.g. low / intermediate / high risk)."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. low risk, intermediate risk, high-risk Duke score"
			bind:value={d.reportingCategory}
		/>
	</Field>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Further imaging, coronary angiography, optimise medical therapy, referral, or routine…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
