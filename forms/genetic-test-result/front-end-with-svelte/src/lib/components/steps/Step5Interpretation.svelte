<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Interpretation">
	<p class="hint">The interpretation, summary impression, and ACMG reporting category.</p>

	<Field label="Interpretation" inputId="interpretation">
		<TextAreaInput
			id="interpretation"
			label="Interpretation"
			rows={4}
			placeholder="Interpretation of the variant(s) in the context of the phenotype and family history…"
			bind:value={d.interpretation}
		/>
	</Field>

	<Field label="Impression" inputId="impression" required>
		<TextAreaInput
			id="impression"
			label="Impression"
			rows={3}
			placeholder="Summary impression / conclusion answering the clinical question…"
			bind:value={d.impression}
		/>
	</Field>

	<Field
		label="Reporting category (ACMG class)"
		inputId="reportingCategory"
		description="Free-text structured-reporting category, e.g. “Class 5 — pathogenic”."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. Class 5 — pathogenic"
			bind:value={d.reportingCategory}
		/>
	</Field>
</Fieldset>
