<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const mh = assessment.data.mentalHealthScreening;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Mental Health Screening">
	<p class="hint">These questions help assess suitability for weight management medication. All responses are confidential.</p>

	<Alert type="info">
		<p>Your mental wellbeing is important. Please answer honestly - there are no wrong answers, and your responses help us provide safe, appropriate care.</p>
	</Alert>

	<Field label="Do you have a history of an eating disorder (e.g., anorexia nervosa, bulimia nervosa, binge eating disorder)?">
		<RadioGroup label="Eating disorder history">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eatingDisorderHistory" value={opt.value} bind:group={mh.eatingDisorderHistory} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if mh.eatingDisorderHistory === 'yes'}
		<Field label="Please provide details about your eating disorder history" inputId="eatingDisorderDetails">
			<TextAreaInput id="eatingDisorderDetails" label="Eating disorder details" placeholder="Type, duration, treatment received..." bind:value={mh.eatingDisorderDetails} />
		</Field>
	{/if}

	<Field label="Do you have a history of depression?">
		<RadioGroup label="Depression history">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="depressionHistory" value={opt.value} bind:group={mh.depressionHistory} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are you currently experiencing thoughts of self-harm or suicide?">
		<RadioGroup label="Suicidal ideation">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="suicidalIdeation" value={opt.value} bind:group={mh.suicidalIdeation} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if mh.suicidalIdeation === 'yes'}
		<Alert type="error">
			<p>If you are in immediate danger, please contact emergency services (999) or the Samaritans (116 123). Your safety is the priority.</p>
		</Alert>
	{/if}

	<Field label="Do you experience body dysmorphia (persistent distress about perceived flaws in physical appearance)?">
		<RadioGroup label="Body dysmorphia">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bodyDysmorphia" value={opt.value} bind:group={mh.bodyDysmorphia} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have a history of binge drinking or alcohol misuse?">
		<RadioGroup label="Binge drinking history">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bingeDrinkingHistory" value={opt.value} bind:group={mh.bingeDrinkingHistory} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Current Mental Health Treatment" inputId="currentMentalHealthTreatment">
		<TextAreaInput id="currentMentalHealthTreatment" label="Current mental health treatment" placeholder="e.g., counselling, CBT, psychiatric medication..." bind:value={mh.currentMentalHealthTreatment} />
	</Field>
</Fieldset>
