<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import YesNoQuestion from '#lib/components/ui/YesNoQuestion.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const c = assessment.data.mentalHealthConditions;
	const stoppedAtQ1 = $derived(
		assessment.data.diagnosisConfirmation.hasMentalHealthDiagnosis === 'no'
	);
</script>

<Fieldset legend="Question 2 — Mental Health Conditions">
	<p class="hint">
		Please confirm what mental health condition you have been diagnosed with.
		Mark Yes or No for each.
	</p>

	{#if stoppedAtQ1}
		<Alert type="info">
			<p>
				You answered <strong>No</strong> to Question 1. The DVLA instructions ask you
				not to complete this question.
			</p>
		</Alert>
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
		<YesNoQuestion label="Other (please specify)" name="other" bind:value={c.other} />

		{#if c.other === 'yes'}
			<Field label="Please specify the other mental health condition" inputId="otherDetails">
				<TextAreaInput id="otherDetails" label="Other details" rows={3} bind:value={c.otherDetails} />
			</Field>
		{/if}

		{#if c.anxietyDepressionWithImpairment === 'yes'}
			<Alert type="warning">
				<p>
					You indicated suicidal thoughts or impairment. If you are in immediate
					danger, please call your local emergency number (999 in the UK) or
					contact the Samaritans on 116 123. Your healthcare professional should
					review this report urgently.
				</p>
			</Alert>
		{/if}
	{/if}
</Fieldset>
