<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.treatmentPreferences;
</script>

<Fieldset title="Treatment Preferences" description="Your preferences and goals for HRT treatment">
	<RadioGroup
		label="Do you have a preference for HRT route of administration?"
		name="routePreference"
		options={[
			{ value: 'oral', label: 'Oral (tablets)' },
			{ value: 'transdermal', label: 'Transdermal (patches/gel)' },
			{ value: 'vaginal', label: 'Vaginal (cream/pessary/ring)' }
		]}
		bind:value={t.routePreference}
	/>

	{#if t.routePreference}
		<TextAreaInput
			label="Why do you prefer this route?"
			name="routePreferenceReason"
			bind:value={t.routePreferenceReason}
			placeholder="e.g., convenience, previous experience, advice from GP..."
		/>
	{/if}

	<TextAreaInput
		label="Do you have any concerns about HRT?"
		name="concernsAboutHRT"
		bind:value={t.concernsAboutHRT}
		placeholder="e.g., cancer risk, weight gain, side effects, long-term use..."
	/>

	<TextAreaInput
		label="Relevant lifestyle factors"
		name="lifestyleFactors"
		bind:value={t.lifestyleFactors}
		placeholder="e.g., exercise frequency, diet, stress levels, work demands..."
	/>

	<TextAreaInput
		label="What are your main goals for treatment?"
		name="treatmentGoals"
		bind:value={t.treatmentGoals}
		placeholder="e.g., reduce hot flushes, improve sleep, protect bone health, improve quality of life..."
	/>
</Fieldset>
