<script lang="ts">
	import { store } from '$lib/stores/fitnote.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = store.data;
</script>

<Fieldset legend="Comments">
	<p class="hint">
		DWP policy 5.6: describe the functional impact and offer practical, work-focused advice. Avoid
		medical jargon. Do not record personal opinions.
	</p>

	<Field label="Comments / functional advice" inputId="comments">
		<TextAreaInput
			id="comments"
			label="Comments / functional advice"
			rows={6}
			placeholder="Avoid lifting > 5 kg. Desk-based duties only for first three weeks."
			bind:value={d.comments}
		/>
	</Field>
</Fieldset>
