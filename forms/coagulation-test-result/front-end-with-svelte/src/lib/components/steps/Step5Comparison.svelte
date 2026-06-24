<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Comparison">
	<p class="hint">Comparison with previous results and the structured-reporting category.</p>

	<Field label="Comparison with previous results" inputId="comparisonWithPrevious">
		<TextAreaInput
			id="comparisonWithPrevious"
			label="Comparison with previous results"
			rows={3}
			placeholder="Relevant previous coagulation results and the trend / delta since…"
			bind:value={d.comparisonWithPrevious}
		/>
	</Field>

	<Field
		label="Reporting category"
		inputId="reportingCategory"
		description="Optional structured-reporting label (e.g. anticoagulant-effect, DIC-picture, isolated-APTT-prolongation)."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. anticoagulant-effect"
			bind:value={d.reportingCategory}
		/>
	</Field>
</Fieldset>
