<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.supportAndHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const supportOptions = [
		{ value: 'strong', label: 'Strong' },
		{ value: 'adequate', label: 'Adequate' },
		{ value: 'limited', label: 'Limited' },
		{ value: 'isolated', label: 'Isolated' }
	];
</script>

<Fieldset legend="Support and History">
	<p class="hint">Background to help your clinician.</p>

	<Field label="Have you ever received mental health support before?">
		<RadioGroup label="Previous mental health care">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousMentalHealthCare" value={opt.value} bind:group={s.previousMentalHealthCare} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.previousMentalHealthCare === 'yes'}
		<Field label="Briefly describe (when, what kind, was it helpful?)" inputId="previousMentalHealthDetails">
			<TextAreaInput id="previousMentalHealthDetails" label="Previous mental health details" rows={3} bind:value={s.previousMentalHealthDetails} />
		</Field>
	{/if}

	<Field label="Are you currently in any form of mental health treatment?">
		<RadioGroup label="Currently in treatment">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="currentlyInTreatment" value={opt.value} bind:group={s.currentlyInTreatment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.currentlyInTreatment === 'yes'}
		<Field label="Describe your current treatment (provider, frequency)" inputId="currentTreatmentDetails">
			<TextAreaInput id="currentTreatmentDetails" label="Current treatment details" rows={3} bind:value={s.currentTreatmentDetails} />
		</Field>
	{/if}

	<Field label="Current medications (psychiatric or otherwise)" inputId="currentMedications">
		<TextAreaInput id="currentMedications" label="Current medications" rows={3} bind:value={s.currentMedications} />
	</Field>

	<Field label="Is there a history of mental health conditions in your family?">
		<RadioGroup label="Family mental health history">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="familyMentalHealthHistory" value={opt.value} bind:group={s.familyMentalHealthHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.familyMentalHealthHistory === 'yes'}
		<Field label="Briefly describe" inputId="familyMentalHealthDetails">
			<TextAreaInput id="familyMentalHealthDetails" label="Family details" rows={2} bind:value={s.familyMentalHealthDetails} />
		</Field>
	{/if}

	<Field label="How would you describe your current social support?">
		<RadioGroup label="Social support">
			{#each supportOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="socialSupport" value={opt.value} bind:group={s.socialSupport} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are you concerned about your alcohol or drug use?">
		<RadioGroup label="Substance use concern">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="substanceUseConcern" value={opt.value} bind:group={s.substanceUseConcern} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
