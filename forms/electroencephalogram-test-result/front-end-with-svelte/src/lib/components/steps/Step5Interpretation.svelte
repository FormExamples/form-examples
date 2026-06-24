<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Interpretation">
	<p class="hint">Correlate the findings with the clinical context and the structured-reporting category.</p>

	<Field label="Clinical correlation" inputId="clinicalCorrelation">
		<TextAreaInput
			id="clinicalCorrelation"
			label="Clinical correlation"
			rows={4}
			placeholder="Correlation of the EEG findings with the clinical context and question…"
			bind:value={d.clinicalCorrelation}
		/>
	</Field>

	<Field
		label="Reporting category"
		inputId="reportingCategory"
		description="A structured-reporting category label (e.g. a SCORE category or epileptiform-classification label)."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. SCORE: focal epileptiform"
			bind:value={d.reportingCategory}
		/>
	</Field>
</Fieldset>
