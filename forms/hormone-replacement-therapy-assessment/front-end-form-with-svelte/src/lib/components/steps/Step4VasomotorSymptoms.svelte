<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const v = assessment.data.vasomotorSymptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Vasomotor Symptoms" description="Detailed assessment of hot flushes and night sweats">
	<Select
		label="How often do you experience hot flushes?"
		name="hotFlushFrequency"
		options={[
			{ value: 'none', label: 'None' },
			{ value: 'occasional', label: 'Occasional (a few per week)' },
			{ value: 'frequent', label: 'Frequent (daily)' },
			{ value: 'very-frequent', label: 'Very frequent (multiple times daily)' }
		]}
		bind:value={v.hotFlushFrequency}
	/>

	<Select
		label="How severe are your hot flushes?"
		name="hotFlushSeverity"
		options={[
			{ value: 'none', label: 'None' },
			{ value: 'mild', label: 'Mild (warm sensation, no disruption)' },
			{ value: 'moderate', label: 'Moderate (sweating, some disruption)' },
			{ value: 'severe', label: 'Severe (drenching sweats, significant disruption)' }
		]}
		bind:value={v.hotFlushSeverity}
	/>

	<RadioGroup label="Do you experience night sweats?" name="nightSweats" options={yesNo} bind:value={v.nightSweats} />
	{#if v.nightSweats === 'yes'}
		<Select
			label="How often do night sweats occur?"
			name="nightSweatsFrequency"
			options={[
				{ value: 'occasional', label: 'Occasional (a few per week)' },
				{ value: 'most-nights', label: 'Most nights' },
				{ value: 'every-night', label: 'Every night' }
			]}
			bind:value={v.nightSweatsFrequency}
		/>
	{/if}

	<TextAreaInput label="Do you notice any triggers for your symptoms?" name="triggers" bind:value={v.triggers} placeholder="e.g., stress, caffeine, alcohol, spicy food, warm environments..." />
</Fieldset>
