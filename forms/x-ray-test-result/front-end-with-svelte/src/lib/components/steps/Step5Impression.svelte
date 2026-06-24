<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Impression">
	<p class="hint">The summary impression and structured reporting category.</p>

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
		description="Structured-reporting label, e.g. normal / abnormal-acute / abnormal-chronic."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. abnormal-acute"
			bind:value={d.reportingCategory}
		/>
	</Field>
</Fieldset>
