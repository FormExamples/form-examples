<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.request;
</script>

<Fieldset legend="4. History">
	<p class="hint">Relevant ocular, medical, and family history that supports vetting.</p>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={4}
			placeholder="Relevant ocular / medical / family history and context for the request…"
			bind:value={d.relevantHistory}
		/>
	</Field>
</Fieldset>
