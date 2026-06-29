<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const c = assessment.data.carePreferences;

	const placeOptions = [
		{ value: 'home', label: 'Home' },
		{ value: 'hospital', label: 'Hospital' },
		{ value: 'hospice', label: 'Hospice' },
		{ value: 'care-home', label: 'Care Home' },
		{ value: 'no-preference', label: 'No Preference' }
	];
</script>

<Fieldset legend="Care Preferences">
	<p class="hint">Where and how you would like to be cared for</p>
	<Field label="Preferred place of care" required><RadioGroup label="Preferred place of care">{#each placeOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="preferredPlaceOfCare" value={opt.value} bind:group={c.preferredPlaceOfCare} required/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Preferred place of death"><RadioGroup label="Preferred place of death">{#each placeOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="preferredPlaceOfDeath" value={opt.value} bind:group={c.preferredPlaceOfDeath}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Personal comfort preferences" inputId="personalComfortPreferences"><TextAreaInput id="personalComfortPreferences" label="Personal comfort preferences" rows={4} placeholder="e.g. I like to have music playing, a particular blanket, scented candles..." bind:value={c.personalComfortPreferences} /></Field>

	<Field label="Daily routine preferences" inputId="dailyRoutinePreferences"><TextAreaInput id="dailyRoutinePreferences" label="Daily routine preferences" rows={4} placeholder="e.g. I like to wake early, have tea at certain times, watch particular TV programmes..." bind:value={c.dailyRoutinePreferences} /></Field>

	<Field label="Dietary requirements and preferences" inputId="dietaryRequirements"><TextAreaInput id="dietaryRequirements" label="Dietary requirements and preferences" rows={3} placeholder="Any dietary requirements, favourite foods, or things you dislike..." bind:value={c.dietaryRequirements} /></Field>

	<Field label="Clothing preferences" inputId="clothingPreferences"><TextAreaInput id="clothingPreferences" label="Clothing preferences" rows={3} placeholder="What you prefer to wear, items that are important to you..." bind:value={c.clothingPreferences} /></Field>

	<Field label="Hygiene and personal care preferences" inputId="hygienePreferences"><TextAreaInput id="hygienePreferences" label="Hygiene and personal care preferences" rows={3} placeholder="e.g. Bath vs shower preference, products you use, hair care..." bind:value={c.hygienePreferences} /></Field>

	<Field label="Environment preferences" inputId="environmentPreferences"><TextAreaInput id="environmentPreferences" label="Environment preferences" rows={3} placeholder="e.g. Temperature, lighting, noise level, having a window open..." bind:value={c.environmentPreferences} /></Field>
</Fieldset>
