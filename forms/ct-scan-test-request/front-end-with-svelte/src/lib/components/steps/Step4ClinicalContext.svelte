<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.context;
</script>

<Fieldset legend="4. Clinical Context">
	<p class="hint">Relevant history and any previous imaging being followed up or compared.</p>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant clinical history and context for the request…"
			bind:value={d.relevantHistory}
		/>
	</Field>

	<Field label="Relevant previous imaging" inputId="relevantPreviousImaging">
		<TextAreaInput
			id="relevantPreviousImaging"
			label="Relevant previous imaging"
			rows={2}
			placeholder="Previous imaging being followed up or used for comparison…"
			bind:value={d.relevantPreviousImaging}
		/>
	</Field>
</Fieldset>
