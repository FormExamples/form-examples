<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const g = assessment.data.goals;
</script>

<Fieldset legend="Step 6 of 8 — Patient goals and shared decisions">
	<p class="hint">Decisions agreed together with the patient.</p>

	<Field
		label="Shared decisions agreed with the patient"
		required
		description="Required for a complete review."
		inputId="goals-sharedDecisions"
	>
		<TextAreaInput
			id="goals-sharedDecisions"
			label="Shared decisions agreed with the patient"
			rows={4}
			placeholder="e.g. Agreed to trial stopping amitriptyline and review pain in 4 weeks"
			bind:value={g.sharedDecisions}
		/>
	</Field>
</Fieldset>
