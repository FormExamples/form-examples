<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = $state(resultStore.data);
</script>

<Fieldset legend="6. Interpretation & Impression">
	<p class="hint">
		The clinical interpretation (sensitisation versus clinically relevant allergy), the summary
		impression, a structured-reporting category, and recommended follow-up.
	</p>

	<Field label="Interpretation" inputId="interpretation">
		<TextAreaInput
			id="interpretation"
			label="Interpretation"
			rows={4}
			placeholder="Interpretation of the reactions in the context of the history (sensitisation vs clinically relevant allergy)…"
			bind:value={d.interpretation}
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

	<Field
		label="Reporting category"
		inputId="reportingCategory"
		description="Optional structured-reporting category label (e.g. a sensitisation pattern or component-resolved diagnostics summary)."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. peanut-component sensitisation (Ara h 2 positive)"
			bind:value={d.reportingCategory}
		/>
	</Field>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Allergen avoidance advice, oral food / drug challenge, immunotherapy referral, or further testing…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
