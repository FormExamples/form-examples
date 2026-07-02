<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.summary;
</script>

<Fieldset legend="Step 12 of 12 — Summary and plan">
	<p class="hint">
		A free-text clinician note. Control status, hypertension stage, and review completeness are
		computed on submit.
	</p>

	<Field label="Clinician note (medication and recall plan)" inputId="summary-reviewContext">
		<TextAreaInput
			id="summary-reviewContext"
			label="Clinician note (medication and recall plan)"
			rows={5}
			placeholder="Free-text summary drawing the review together, with the plan and recall interval."
			bind:value={s.reviewContext}
		/>
	</Field>
</Fieldset>
