<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const ss = assessment.data.socialSupport;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Social & Support">
	<p class="hint">Family history, support systems, and previous assessments.</p>

	<Field label="Do any family members have ADHD (diagnosed or suspected)?">
		<RadioGroup label="Family history of ADHD">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="familyHistoryADHD" value={opt.value} bind:group={ss.familyHistoryADHD} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if ss.familyHistoryADHD === 'yes'}
		<Field label="Family history details" inputId="familyHistoryDetails">
			<TextAreaInput id="familyHistoryDetails" label="Family history details" rows={2} bind:value={ss.familyHistoryDetails} />
		</Field>
	{/if}

	<Field label="What support systems do you currently have?" inputId="supportSystems">
		<TextAreaInput id="supportSystems" label="Support systems" rows={3} bind:value={ss.supportSystems} />
	</Field>

	<Field label="What coping strategies do you use for attention/focus difficulties?" inputId="copingStrategies">
		<TextAreaInput id="copingStrategies" label="Coping strategies" rows={3} bind:value={ss.copingStrategies} />
	</Field>

	<Field label="Have you had any previous ADHD assessments?">
		<RadioGroup label="Previous assessments">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousAssessments" value={opt.value} bind:group={ss.previousAssessments} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if ss.previousAssessments === 'yes'}
		<Field label="Previous assessment details" inputId="previousAssessmentDetails">
			<TextAreaInput id="previousAssessmentDetails" label="Previous assessment details" rows={2} bind:value={ss.previousAssessmentDetails} />
		</Field>
	{/if}

	<Field label="Have you received a previous ADHD diagnosis?">
		<RadioGroup label="Previous diagnosis">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousDiagnosis" value={opt.value} bind:group={ss.previousDiagnosis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if ss.previousDiagnosis === 'yes'}
		<Field label="Previous diagnosis details" inputId="previousDiagnosisDetails">
			<TextAreaInput id="previousDiagnosisDetails" label="Previous diagnosis details" rows={2} bind:value={ss.previousDiagnosisDetails} />
		</Field>
	{/if}
</Fieldset>
