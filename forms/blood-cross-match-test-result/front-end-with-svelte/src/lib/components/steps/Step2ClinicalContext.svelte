<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Clinical Context">
	<p class="hint">The clinical history and transfusion indication relevant to interpreting the result.</p>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={4}
			placeholder="Clinical history, transfusion indication, and the question the testing was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>
</Fieldset>
