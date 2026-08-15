<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Clinical History">
	<p class="hint">The clinical history and the question the procedure was performed to answer.</p>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={4}
			placeholder="Clinical history and the question the procedure was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>
</Fieldset>
