<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const p = assessment.data.performanceRatings;

	const activities = [
		{ key: 'activity1' as const, label: 'Activity 1' },
		{ key: 'activity2' as const, label: 'Activity 2' },
		{ key: 'activity3' as const, label: 'Activity 3' },
		{ key: 'activity4' as const, label: 'Activity 4' },
		{ key: 'activity5' as const, label: 'Activity 5' }
	];
</script>

<Fieldset legend="Performance Ratings">
	<p class="hint">Rate how well you can perform each identified activity (COPM Performance Scale 1-10). Identify up to 5 activities.</p>

	{#each activities as activity (activity.key)}
		<Field label={`${activity.label} - Name`} inputId={`${activity.key}Name`}>
			<TextInput id={`${activity.key}Name`} label={`${activity.label} name`} placeholder="e.g., Dressing, Cooking, Driving" bind:value={p[activity.key].name} />
		</Field>
		<div class="field-grid">
			<Field label={`${activity.label} - Importance (1-10)`} inputId={`${activity.key}Importance`}>
				<NumberInput id={`${activity.key}Importance`} label="Importance" min={1} max={10} bind:value={p[activity.key].importance} />
			</Field>
			<Field label={`${activity.label} - Performance Score (1-10)`} inputId={`${activity.key}Performance`}>
				<NumberInput id={`${activity.key}Performance`} label="Performance Score" min={1} max={10} bind:value={p[activity.key].performanceScore} />
			</Field>
		</div>
	{/each}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
