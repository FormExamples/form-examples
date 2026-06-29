<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.historySecondaryAssessment;
</script>

<Fieldset legend="History Taking & Secondary Assessment">
	<p class="hint">OPQRST and SAMPLE history, focused exam, baseline vitals, and interventions.</p>

	<TriStateField label="Elicits the chief complaint clearly." name="chiefComplaint" bind:value={d.chiefComplaint} />
	<TriStateField label="Obtains OPQRST history of the present illness." name="historyOnsetOpqrst" bind:value={d.historyOnsetOpqrst} />

	<h3 class="subhead">SAMPLE history</h3>
	<TriStateField label="SAMPLE — Signs / Symptoms." name="sampleSignsSymptoms" bind:value={d.sampleSignsSymptoms} />
	<TriStateField label="SAMPLE — Allergies." name="sampleAllergies" bind:value={d.sampleAllergies} />
	<TriStateField label="SAMPLE — Medications." name="sampleMedications" bind:value={d.sampleMedications} />
	<TriStateField label="SAMPLE — Past pertinent medical / surgical history." name="samplePastHistory" bind:value={d.samplePastHistory} />
	<TriStateField label="SAMPLE — Last oral intake." name="sampleLastIntake" bind:value={d.sampleLastIntake} />
	<TriStateField label="SAMPLE — Events leading up to the illness." name="sampleEvents" bind:value={d.sampleEvents} />

	<h3 class="subhead">Secondary assessment</h3>
	<TriStateField label="Performs a focused / detailed physical exam appropriate to the chief complaint." name="focusedExam" bind:value={d.focusedExam} />
	<TriStateField label="Obtains baseline blood pressure." name="baselineVitalsBp" bind:value={d.baselineVitalsBp} />
	<TriStateField label="Obtains baseline pulse rate and quality." name="baselineVitalsPulse" bind:value={d.baselineVitalsPulse} />
	<TriStateField label="Obtains baseline respiratory rate and quality." name="baselineVitalsRespirations" bind:value={d.baselineVitalsRespirations} />
	<TriStateField label="States a field impression / working diagnosis." name="fieldImpression" bind:value={d.fieldImpression} />
	<TriStateField label="Initiates appropriate interventions and verbalizes care plan." name="interventions" bind:value={d.interventions} />
</Fieldset>

<style>
	.subhead {
		margin: 1rem 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
	}
</style>
