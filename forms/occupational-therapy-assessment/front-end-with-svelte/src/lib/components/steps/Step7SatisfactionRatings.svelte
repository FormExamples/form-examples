<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const s = assessment.data.satisfactionRatings;

	const activities = [
		{ key: 'activity1' as const, label: 'Activity 1' },
		{ key: 'activity2' as const, label: 'Activity 2' },
		{ key: 'activity3' as const, label: 'Activity 3' },
		{ key: 'activity4' as const, label: 'Activity 4' },
		{ key: 'activity5' as const, label: 'Activity 5' }
	];
</script>

<Fieldset legend="Satisfaction Ratings">
	<p class="hint">Rate how satisfied you are with your performance in each activity (COPM Satisfaction Scale 1-10).</p>

	{#each activities as activity (activity.key)}
		<Field label={`${activity.label} - Name`} inputId={`${activity.key}SatName`}>
			<TextInput id={`${activity.key}SatName`} label={`${activity.label} name`} placeholder="e.g., Dressing, Cooking, Driving" bind:value={s[activity.key].name} />
		</Field>
		<Field label={`${activity.label} - Satisfaction Score (1-10)`} inputId={`${activity.key}Satisfaction`}>
			<NumberInput id={`${activity.key}Satisfaction`} label="Satisfaction Score" min={1} max={10} bind:value={s[activity.key].satisfactionScore} />
		</Field>
	{/each}
</Fieldset>
