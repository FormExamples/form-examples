<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Interpretation">
	<p class="hint">The narrative interpretation and a structured reporting category.</p>

	<Field label="Interpretation" inputId="interpretation">
		<TextAreaInput
			id="interpretation"
			label="Interpretation"
			rows={5}
			placeholder="Narrative interpretation of the ECG findings (the body of the report)…"
			bind:value={d.interpretation}
		/>
	</Field>

	<Field
		label="Reporting category"
		inputId="reportingCategory"
		description="Structured-reporting category or coded label for the dominant interpretation."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. acute-ischaemia, actionable-finding, normal"
			bind:value={d.reportingCategory}
		/>
	</Field>
</Fieldset>
