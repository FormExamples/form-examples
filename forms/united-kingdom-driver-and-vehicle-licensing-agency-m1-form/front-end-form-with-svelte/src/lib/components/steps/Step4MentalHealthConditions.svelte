<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import YesNoQuestion from '$lib/components/ui/YesNoQuestion.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const c = assessment.data.mentalHealthConditions;
	const stoppedAtQ1 = $derived(
		assessment.data.diagnosisConfirmation.hasMentalHealthDiagnosis === 'no'
	);
</script>

<SectionCard
	title="Question 2 — Mental Health Conditions"
	description="Please confirm what mental health condition you have been diagnosed with. Mark Yes or No for each."
>
	{#if stoppedAtQ1}
		<div class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
			You answered <strong>No</strong> to Question 1. The DVLA instructions ask you
			not to complete this question. You may continue to the authorisation step.
		</div>
	{:else}
		<YesNoQuestion
			label="Anxiety or depression (without any impairment of concentration, memory or agitation)"
			name="anxDepWithoutImp"
			bind:value={c.anxietyDepressionWithoutImpairment}
		/>
		<YesNoQuestion
			label="Anxiety or depression (with suicidal thoughts or impairment in concentration, memory or agitation)"
			name="anxDepWithImp"
			bind:value={c.anxietyDepressionWithImpairment}
		/>
		<YesNoQuestion
			label="Bipolar affective disorder"
			name="bipolar"
			bind:value={c.bipolarAffectiveDisorder}
		/>
		<YesNoQuestion
			label="Eating disorder (anorexia nervosa, bulimia)"
			name="eatingDisorder"
			bind:value={c.eatingDisorder}
		/>
		<YesNoQuestion
			label="Obsessive compulsive disorder or post-traumatic stress disorder"
			name="ocdOrPtsd"
			bind:value={c.ocdOrPtsd}
		/>
		<YesNoQuestion
			label="Personality disorder (any type)"
			name="personalityDisorder"
			bind:value={c.personalityDisorder}
		/>
		<YesNoQuestion
			label="Schizophrenia or psychosis or delusional disorder or schizoaffective disorder"
			name="schizophreniaOrPsychosis"
			bind:value={c.schizophreniaOrPsychosis}
		/>
		<YesNoQuestion
			label="Other (please specify)"
			name="other"
			bind:value={c.other}
		/>

		{#if c.other === 'yes'}
			<TextArea
				label="Please specify the other mental health condition"
				name="otherDetails"
				bind:value={c.otherDetails}
				rows={3}
			/>
		{/if}

		{#if c.anxietyDepressionWithImpairment === 'yes'}
			<div
				class="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
			>
				You indicated suicidal thoughts or impairment. If you are in immediate
				danger, please call your local emergency number (999 in the UK) or
				contact the Samaritans on 116 123. Your healthcare professional should
				review this report urgently.
			</div>
		{/if}
	{/if}
</SectionCard>
