<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.clinicalRecommendation;
</script>

<Fieldset legend="Clinical Recommendation">
	<p class="hint">Optional clinician fields summarising next steps.</p>

	<div class="field-grid">
		<Field label="Clinician name" inputId="clinicalRecommendation-clinicianName">
			<TextInput id="clinicalRecommendation-clinicianName" label="Clinician name" bind:value={c.clinicianName} />
		</Field>
		<Field label="Assessment date" inputId="clinicalRecommendation-assessmentDate">
			<DateInput id="clinicalRecommendation-assessmentDate" label="Assessment date" bind:value={c.assessmentDate} />
		</Field>
	</div>

	<Field label="Recommendation" inputId="clinicalRecommendation-recommendation">
		<Select id="clinicalRecommendation-recommendation" label="Recommendation" bind:value={c.recommendation}>
			<option value="">-- Select --</option>
			<option value="continue-attempts">Continue attempts</option>
			<option value="lifestyle-optimisation">Lifestyle optimisation</option>
			<option value="targeted-treatment">Targeted medical treatment</option>
			<option value="specialist-referral">Specialist referral</option>
			<option value="art-referral">ART (IVF/ICSI) referral</option>
		</Select>
	</Field>

	<Field label="Referral urgency" inputId="clinicalRecommendation-referralUrgency">
		<Select id="clinicalRecommendation-referralUrgency" label="Referral urgency" bind:value={c.referralUrgency}>
			<option value="">-- Select --</option>
			<option value="routine">Routine</option>
			<option value="soon">Soon (&lt; 6 weeks)</option>
			<option value="urgent">Urgent (&lt; 2 weeks)</option>
		</Select>
	</Field>

	<Field label="Additional notes for the clinical team" inputId="clinicalRecommendation-additionalNotes">
		<TextAreaInput id="clinicalRecommendation-additionalNotes" label="Additional notes" rows={4} placeholder="Anything else relevant to the assessment…" bind:value={c.additionalNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
