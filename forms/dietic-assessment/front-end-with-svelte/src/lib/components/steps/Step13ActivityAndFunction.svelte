<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;

	// The native <select> value is a string; the model stores a number.
	// These proxies keep the two in step without leaking strings into the engine.
	let sarcfStrengthProxy = $state(d.activity.sarcfStrength === null ? '' : String(d.activity.sarcfStrength));
	$effect(() => {
		d.activity.sarcfStrength = sarcfStrengthProxy === '' ? null : Number(sarcfStrengthProxy);
	});
	let sarcfWalkingProxy = $state(d.activity.sarcfWalking === null ? '' : String(d.activity.sarcfWalking));
	$effect(() => {
		d.activity.sarcfWalking = sarcfWalkingProxy === '' ? null : Number(sarcfWalkingProxy);
	});
	let sarcfRisingFromChairProxy = $state(d.activity.sarcfRisingFromChair === null ? '' : String(d.activity.sarcfRisingFromChair));
	$effect(() => {
		d.activity.sarcfRisingFromChair = sarcfRisingFromChairProxy === '' ? null : Number(sarcfRisingFromChairProxy);
	});
	let sarcfClimbingStairsProxy = $state(d.activity.sarcfClimbingStairs === null ? '' : String(d.activity.sarcfClimbingStairs));
	$effect(() => {
		d.activity.sarcfClimbingStairs = sarcfClimbingStairsProxy === '' ? null : Number(sarcfClimbingStairsProxy);
	});
	let sarcfFallsProxy = $state(d.activity.sarcfFalls === null ? '' : String(d.activity.sarcfFalls));
	$effect(() => {
		d.activity.sarcfFalls = sarcfFallsProxy === '' ? null : Number(sarcfFallsProxy);
	});
</script>

<Fieldset legend="13. Physical Activity and Function">
	<p class="hint">Activity level, mobility, and the five SARC-F sarcopenia case-finding components.</p>

	<Field label="Activity level" inputId="activity-activityLevel">
		<Select id="activity-activityLevel" label="Activity level" bind:value={d.activity.activityLevel}>
			<option value="">— Select —</option>
			{#each OPTIONS.activityLevel as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Mobility" inputId="activity-mobility">
		<Select id="activity-mobility" label="Mobility" bind:value={d.activity.mobility}>
			<option value="">— Select —</option>
			{#each OPTIONS.mobility as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Exercise type" inputId="activity-exerciseType">
		<TextInput id="activity-exerciseType" label="Exercise type" bind:value={d.activity.exerciseType} />
	</Field>
	<Field label="Exercise (minutes/week)" inputId="activity-exerciseMinutesPerWeek">
		<NumberInput id="activity-exerciseMinutesPerWeek" label="Exercise (minutes/week)" min={0} max={3000} bind:value={d.activity.exerciseMinutesPerWeek} />
	</Field>
	<Field label="Sedentary time (hours/day)" inputId="activity-sedentaryHoursPerDay">
		<NumberInput id="activity-sedentaryHoursPerDay" label="Sedentary time (hours/day)" min={0} max={24} step="0.1" bind:value={d.activity.sedentaryHoursPerDay} />
	</Field>
	<Field label="Falls in the last 12 months" inputId="activity-fallsInLast12Months">
		<NumberInput id="activity-fallsInLast12Months" label="Falls in the last 12 months" min={0} max={100} bind:value={d.activity.fallsInLast12Months} />
	</Field>
	<Field label="SARC-F: lifting and carrying 4.5 kg" inputId="activity-sarcfStrength">
		<Select id="activity-sarcfStrength" label="SARC-F: lifting and carrying 4.5 kg" bind:value={sarcfStrengthProxy}>
			<option value="">— Select —</option>
			{#each OPTIONS.sarcf as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="SARC-F: walking across a room" inputId="activity-sarcfWalking">
		<Select id="activity-sarcfWalking" label="SARC-F: walking across a room" bind:value={sarcfWalkingProxy}>
			<option value="">— Select —</option>
			{#each OPTIONS.sarcf as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="SARC-F: rising from a chair or bed" inputId="activity-sarcfRisingFromChair">
		<Select id="activity-sarcfRisingFromChair" label="SARC-F: rising from a chair or bed" bind:value={sarcfRisingFromChairProxy}>
			<option value="">— Select —</option>
			{#each OPTIONS.sarcf as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="SARC-F: climbing ten stairs" inputId="activity-sarcfClimbingStairs">
		<Select id="activity-sarcfClimbingStairs" label="SARC-F: climbing ten stairs" bind:value={sarcfClimbingStairsProxy}>
			<option value="">— Select —</option>
			{#each OPTIONS.sarcf as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="SARC-F: falls in the past year" inputId="activity-sarcfFalls">
		<Select id="activity-sarcfFalls" label="SARC-F: falls in the past year" bind:value={sarcfFallsProxy}>
			<option value="">— Select —</option>
			{#each OPTIONS.sarcf as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Eats and drinks independently" inputId="activity-eatsIndependently">
		<Select id="activity-eatsIndependently" label="Eats and drinks independently" bind:value={d.activity.eatsIndependently}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Feeding assistance required" inputId="activity-feedingAssistanceRequired">
		<Select id="activity-feedingAssistanceRequired" label="Feeding assistance required" bind:value={d.activity.feedingAssistanceRequired}>
			<option value="">— Select —</option>
			{#each OPTIONS.feedingAssistance as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Function notes" inputId="activity-functionNotes">
		<TextAreaInput id="activity-functionNotes" label="Function notes" rows={2} bind:value={d.activity.functionNotes} />
	</Field>
</Fieldset>
