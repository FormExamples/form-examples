<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.clinicalRecommendation;
</script>

<Fieldset legend="Clinical Recommendation" description="Free-text notes for the prescribing clinician.">
	<TextAreaInput
		label="Clinical notes"
		name="clinicalNotes"
		rows={6}
		placeholder="Summary, recommended method, counselling notes, and follow-up plan."
		bind:value={c.clinicalNotes}
	/>
</Fieldset>
