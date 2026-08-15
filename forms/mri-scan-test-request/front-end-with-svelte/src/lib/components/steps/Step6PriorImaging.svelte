<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = request.data.priorImaging;
</script>

<Fieldset legend="Prior imaging">
	<p class="hint">Relevant previous imaging available for comparison.</p>

	<Field label="Relevant previous imaging" inputId="relevantPreviousImaging">
		<TextAreaInput
			id="relevantPreviousImaging"
			label="Relevant previous imaging"
			rows={3}
			placeholder="e.g. CT chest 2026-01-12 — indeterminate nodule."
			bind:value={d.relevantPreviousImaging}
		/>
	</Field>
</Fieldset>
