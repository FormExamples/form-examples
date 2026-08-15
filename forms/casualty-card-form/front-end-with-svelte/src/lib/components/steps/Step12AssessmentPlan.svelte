<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const ap = assessment.data.assessmentPlan;
</script>

<Fieldset title="Assessment & Plan" description="Working diagnosis and clinical plan">
	<TextInput label="Working Diagnosis" name="workingDiagnosis" bind:value={ap.workingDiagnosis} required />
	<TextAreaInput label="Differential Diagnoses" name="differentialDiagnoses" bind:value={ap.differentialDiagnoses} rows={3} />
	<TextAreaInput label="Clinical Impression" name="clinicalImpression" bind:value={ap.clinicalImpression} rows={3} />
	<TextAreaInput label="Risk Stratification" name="riskStratification" bind:value={ap.riskStratification} rows={2} placeholder="e.g. HEART score, Wells score, CURB-65" />
</Fieldset>
