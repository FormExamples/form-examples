<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const v = assessment.data.review;
</script>

<Fieldset legend="Step 9 of 9 — Summary and review">
	<p class="hint">
		Anything else the receiving service should know. On submit, the engine checks completeness,
		echoes the urgency, and raises any flags.
	</p>

	<Field label="Free-text note" inputId="review-clinicalNote">
		<TextAreaInput
			id="review-clinicalNote"
			label="Free-text note"
			rows={3}
			placeholder="Anything else the receiving service should know."
			bind:value={v.clinicalNote}
		/>
	</Field>
</Fieldset>
