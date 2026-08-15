<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import YesNoQuestion from '#lib/components/ui/YesNoQuestion.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const d = assessment.data.diagnosisConfirmation;
</script>

<Fieldset legend="Question 1 — Diagnosis Confirmation">
	<p class="hint">Medical Questionnaire — Mental Health.</p>

	<YesNoQuestion
		label="Have you been diagnosed with a mental health condition?"
		name="hasMentalHealthDiagnosis"
		bind:value={d.hasMentalHealthDiagnosis}
		required
	/>

	{#if d.hasMentalHealthDiagnosis === 'no'}
		<Alert type="info">
			<p>
				You answered <strong>No</strong>. The DVLA instructions ask you not to
				complete the rest of this form. You can still continue to the
				authorisation step to submit, or start over.
			</p>
		</Alert>
	{/if}
</Fieldset>
