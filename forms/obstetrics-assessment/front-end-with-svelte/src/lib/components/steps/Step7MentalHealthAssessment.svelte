<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const mh = assessment.data.mentalHealthAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const gadOptions = [
		{ value: 'not-at-all', label: 'Not at all (0)' },
		{ value: 'several-days', label: 'Several days (1)' },
		{ value: 'more-than-half', label: 'More than half the days (2)' },
		{ value: 'nearly-every-day', label: 'Nearly every day (3)' }
	];
</script>

<Fieldset legend="Mental Health Assessment">
	<p class="hint">NICE-recommended Whooley (depression) and GAD-2 (anxiety) screens.</p>

	<Field label="Whooley 1: During the past month, have you often been bothered by feeling down, depressed or hopeless?">
		<RadioGroup label="Whooley 1">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="whooley1" value={opt.value} bind:group={mh.whooley1} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Whooley 2: During the past month, have you often been bothered by having little interest or pleasure in doing things?">
		<RadioGroup label="Whooley 2">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="whooley2" value={opt.value} bind:group={mh.whooley2} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="GAD-2 Q1: Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious or on edge?">
		<RadioGroup label="GAD-2 Q1">
			{#each gadOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="gad2Q1" value={opt.value} bind:group={mh.gad2Q1} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="GAD-2 Q2: Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?">
		<RadioGroup label="GAD-2 Q2">
			{#each gadOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="gad2Q2" value={opt.value} bind:group={mh.gad2Q2} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous postnatal depression?">
		<RadioGroup label="Previous postnatal depression?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousPostnatalDepression" value={opt.value} bind:group={mh.previousPostnatalDepression} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous severe mental illness (bipolar, psychosis, schizophrenia)?">
		<RadioGroup label="Previous severe mental illness?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousSevereMentalIllness" value={opt.value} bind:group={mh.previousSevereMentalIllness} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Currently on psychotropic medication?">
		<RadioGroup label="Currently on psychotropic medication?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="currentlyOnPsychotropicMeds" value={opt.value} bind:group={mh.currentlyOnPsychotropicMeds} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Any thoughts of self-harm or suicide?">
		<RadioGroup label="Any thoughts of self-harm or suicide?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="selfHarmIdeation" value={opt.value} bind:group={mh.selfHarmIdeation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Mental health notes" inputId="mentalHealthNotes">
		<TextAreaInput id="mentalHealthNotes" label="Mental health notes" rows={3} placeholder="Add any context about mental-health needs and supports." bind:value={mh.mentalHealthNotes} />
	</Field>
</Fieldset>
