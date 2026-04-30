<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const f = assessment.data.functionalImpact;

	const impactOptions = [
		{ value: 'none', label: 'No impact' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
</script>

<SectionCard
	title="Functional Impact"
	description="How much have your difficulties affected the following areas of your life?"
>
	<RadioGroup
		label="Work or study"
		name="workImpact"
		options={impactOptions}
		bind:value={f.workImpact}
	/>

	<RadioGroup
		label="Relationships with family or friends"
		name="relationshipImpact"
		options={impactOptions}
		bind:value={f.relationshipImpact}
	/>

	<RadioGroup
		label="Daily activities (e.g. self-care, errands, hobbies)"
		name="dailyActivitiesImpact"
		options={impactOptions}
		bind:value={f.dailyActivitiesImpact}
	/>

	<RadioGroup
		label="Sleep"
		name="sleepImpact"
		options={impactOptions}
		bind:value={f.sleepImpact}
	/>

	<TextArea
		label="Anything else you would like the clinician to know about how this is affecting your life?"
		name="functionalNotes"
		bind:value={f.notes}
		rows={3}
	/>
</SectionCard>
