<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.assessmentAndPlan;
</script>

<Fieldset
	title="Assessment & Plan"
	description="Summary, differential, and plan (imaging, medications / interventions, consults with time called/arrived and recommendations)."
>
	<TextAreaInput
		label="Narrative"
		name="apNarrative"
		bind:value={a.narrative}
		rows={8}
		required
		placeholder="Summary, differential diagnoses, plan for imaging / interventions / consults."
	/>
</Fieldset>
