<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Clinical History">
	<p class="hint">The clinical question and any comparison with previous cytology / histology.</p>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={3}
			placeholder="Clinical history and the question the examination was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>

	<Field label="Comparison with previous" inputId="comparisonWithPrevious">
		<TextAreaInput
			id="comparisonWithPrevious"
			label="Comparison with previous"
			rows={3}
			placeholder="Relevant previous cytology / histology results and changes since…"
			bind:value={d.comparisonWithPrevious}
		/>
	</Field>
</Fieldset>
