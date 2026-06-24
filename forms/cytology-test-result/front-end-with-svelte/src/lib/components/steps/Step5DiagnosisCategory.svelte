<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Diagnosis & Category">
	<p class="hint">The cytological diagnosis and the structured-reporting grading category.</p>

	<Field label="Diagnosis" inputId="diagnosis">
		<TextAreaInput
			id="diagnosis"
			label="Diagnosis"
			rows={3}
			placeholder="Cytological diagnosis / interpretation…"
			bind:value={d.diagnosis}
		/>
	</Field>

	<Field
		label="Reporting (grading) category"
		inputId="reportingCategory"
		description="The structured-reporting grading label (e.g. an NHS cervical-screening dyskaryosis grade, RCPath Thy or breast C category)."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting (grading) category"
			placeholder="e.g. high-grade dyskaryosis (severe), Thy5, C5…"
			bind:value={d.reportingCategory}
		/>
	</Field>
</Fieldset>
