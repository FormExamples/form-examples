<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { requestStore } from '$lib/stores/request.svelte';

	const d = requestStore.data.detail;
</script>

<Fieldset legend="4. Clinical Detail">
	<p class="hint">The specific clinical question and relevant history — the highest-value fields.</p>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="e.g. Exclude fracture following a fall onto the outstretched right hand."
			bind:value={d.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant clinical history and context for the request…"
			bind:value={d.relevantHistory}
		/>
	</Field>
</Fieldset>
