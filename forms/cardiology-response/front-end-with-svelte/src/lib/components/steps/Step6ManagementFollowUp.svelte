<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Management & Follow-up">
	<p class="hint">The management plan, medication changes, and recommended follow-up.</p>

	<Field label="Management plan" inputId="managementPlan">
		<TextAreaInput
			id="managementPlan"
			label="Management plan"
			rows={4}
			placeholder="Management plan including investigations arranged and treatment…"
			bind:value={d.managementPlan}
		/>
	</Field>

	<Field label="Medication changes" inputId="medicationChanges">
		<TextAreaInput
			id="medicationChanges"
			label="Medication changes"
			rows={3}
			placeholder="Medication changes recommended or made…"
			bind:value={d.medicationChanges}
		/>
	</Field>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Recommended follow-up, including who should action it and when…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
