<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const r = assessment.data.repetitiveTasks;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Repetitive Tasks" description="Tasks performed repeatedly during work">
	<TextAreaInput label="Describe the main repetitive task(s)" name="taskDesc" bind:value={r.taskDescription} placeholder="e.g., typing, mouse clicking, assembly line work..." />

	<Select
		label="How often do you perform this task?"
		name="frequency"
		options={[
			{ value: 'rarely', label: 'Rarely (a few times per day)' },
			{ value: 'occasionally', label: 'Occasionally (several times per day)' },
			{ value: 'frequently', label: 'Frequently (most of the day)' },
			{ value: 'constantly', label: 'Constantly (almost all day)' }
		]}
		bind:value={r.frequency}
	/>

	<Select
		label="Duration per session"
		name="duration"
		options={[
			{ value: 'less-than-1hr', label: 'Less than 1 hour' },
			{ value: '1-2hrs', label: '1-2 hours' },
			{ value: '2-4hrs', label: '2-4 hours' },
			{ value: 'more-than-4hrs', label: 'More than 4 hours' }
		]}
		bind:value={r.durationPerSession}
	/>

	<Select
		label="Force required for the task"
		name="force"
		options={[
			{ value: 'none', label: 'None / negligible' },
			{ value: 'light', label: 'Light' },
			{ value: 'moderate', label: 'Moderate' },
			{ value: 'heavy', label: 'Heavy' }
		]}
		bind:value={r.forceRequired}
	/>

	<RadioGroup label="Is there vibration exposure (e.g., power tools)?" name="vibration" options={yesNo} bind:value={r.vibrationExposure} />

	<NumberInput label="Cycle time (seconds per repetition)" name="cycleTime" bind:value={r.cycleTimeSeconds} min={0} max={3600} unit="seconds" />
</Fieldset>
