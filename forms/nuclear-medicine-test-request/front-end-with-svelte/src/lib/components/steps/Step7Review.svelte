<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = request.data.triage;
</script>

<Fieldset legend="Review &amp; submit">
	<p class="hint">
		Add any notes, then submit to compute the four-axis grade, flags, and recommendation.
	</p>

	<Field label="Notes" inputId="notes">
		<TextAreaInput id="notes" label="Notes" rows={3} bind:value={d.notes} />
	</Field>
</Fieldset>
