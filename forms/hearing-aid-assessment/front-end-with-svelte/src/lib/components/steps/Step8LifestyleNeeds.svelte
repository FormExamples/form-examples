<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const l = assessment.data.lifestyleNeeds;

	const techOptions = [
		{ value: 'very-comfortable', label: 'Very comfortable' },
		{ value: 'comfortable', label: 'Comfortable' },
		{ value: 'somewhat-comfortable', label: 'Somewhat comfortable' },
		{ value: 'uncomfortable', label: 'Uncomfortable' }
	];

	const dexOptions = [
		{ value: 'good', label: 'Good' },
		{ value: 'fair', label: 'Fair' },
		{ value: 'poor', label: 'Poor' }
	];
</script>

<Fieldset legend="Lifestyle & Needs">
	<p class="hint">Help us understand your daily life and hearing needs.</p>

	<Field label="Describe your social activity level" inputId="socialActivity"><TextAreaInput id="socialActivity" label="Social activity" rows={3} placeholder="e.g., very active social life, regular church attendance, frequent dining out..." bind:value={l.socialActivity} /></Field>

	<Field label="Occupation or daily activity requirements" inputId="occupationRequirements"><TextAreaInput id="occupationRequirements" label="Occupation requirements" rows={3} placeholder="e.g., retired, office environment, meetings, phone calls..." bind:value={l.occupationRequirements} /></Field>

	<Field label="Hobbies and leisure activities" inputId="hobbies"><TextAreaInput id="hobbies" label="Hobbies" rows={3} placeholder="e.g., music, theatre, sports, gardening..." bind:value={l.hobbies} /></Field>

	<Field label="How comfortable are you with technology?">
		<RadioGroup label="Technology comfort">{#each techOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="technologyComfort" value={opt.value} bind:group={l.technologyComfort} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="Manual dexterity (ability to handle small objects)">
		<RadioGroup label="Dexterity">{#each dexOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="dexterity" value={opt.value} bind:group={l.dexterity} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="Vision status">
		<RadioGroup label="Vision status">{#each dexOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="visionStatus" value={opt.value} bind:group={l.visionStatus} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
</Fieldset>
