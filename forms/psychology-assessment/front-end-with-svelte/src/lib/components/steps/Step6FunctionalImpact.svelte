<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.functionalImpact;
	const impactOptions = [
		{ value: 'none', label: 'No impact' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];

	const impacts: { key: 'workImpact' | 'relationshipImpact' | 'dailyActivitiesImpact' | 'sleepImpact'; name: string; label: string }[] = [
		{ key: 'workImpact', name: 'workImpact', label: 'Work or study' },
		{ key: 'relationshipImpact', name: 'relationshipImpact', label: 'Relationships with family or friends' },
		{ key: 'dailyActivitiesImpact', name: 'dailyActivitiesImpact', label: 'Daily activities (e.g. self-care, errands, hobbies)' },
		{ key: 'sleepImpact', name: 'sleepImpact', label: 'Sleep' }
	];
</script>

<Fieldset legend="Functional Impact">
	<p class="hint">How much have your difficulties affected the following areas of your life?</p>

	{#each impacts as i (i.key)}
		<Field label={i.label}>
			<RadioGroup label={i.label}>
				{#each impactOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={i.name} value={opt.value} bind:group={f[i.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Anything else you would like the clinician to know about how this is affecting your life?" inputId="functionalNotes">
		<TextAreaInput id="functionalNotes" label="Notes" rows={3} bind:value={f.notes} />
	</Field>
</Fieldset>
