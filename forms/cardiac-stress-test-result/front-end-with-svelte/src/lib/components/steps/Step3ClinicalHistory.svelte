<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Haemodynamic & Exercise Response">
	<p class="hint">Peak heart rate, functional capacity, and blood-pressure response.</p>

	<Field
		label="Maximum heart rate (bpm)"
		inputId="maximumHeartRateBpm"
		description="Maximum heart rate achieved during the test."
	>
		<NumberInput
			id="maximumHeartRateBpm"
			label="Maximum heart rate (bpm)"
			min={0}
			max={300}
			step={1}
			bind:value={d.maximumHeartRateBpm}
		/>
	</Field>

	<Field
		label="Percent-predicted heart rate (%)"
		inputId="percentPredictedHeartRate"
		description="Percentage of the age-predicted maximum heart rate (≥85% for an adequate test)."
	>
		<NumberInput
			id="percentPredictedHeartRate"
			label="Percent-predicted heart rate (%)"
			min={0}
			max={200}
			step={0.1}
			bind:value={d.percentPredictedHeartRate}
		/>
	</Field>

	<Field label="Exercise duration (minutes)" inputId="exerciseDurationMinutes">
		<NumberInput
			id="exerciseDurationMinutes"
			label="Exercise duration (minutes)"
			min={0}
			max={120}
			step={0.1}
			bind:value={d.exerciseDurationMinutes}
		/>
	</Field>

	<Field
		label="METs achieved"
		inputId="metsAchieved"
		description="Peak metabolic equivalents (functional capacity)."
	>
		<NumberInput
			id="metsAchieved"
			label="METs achieved"
			min={0}
			max={30}
			step={0.1}
			bind:value={d.metsAchieved}
		/>
	</Field>

	<Field label="Peak blood pressure" inputId="peakBloodPressure">
		<TextInput
			id="peakBloodPressure"
			label="Peak blood pressure"
			placeholder="e.g. 180/90"
			bind:value={d.peakBloodPressure}
		/>
	</Field>

	<Field label="Blood-pressure response" inputId="bloodPressureResponse">
		<Select id="bloodPressureResponse" label="Blood-pressure response" bind:value={d.bloodPressureResponse}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="hypertensive">Hypertensive</option>
			<option value="hypotensive">Hypotensive (exertional)</option>
			<option value="flat">Flat</option>
		</Select>
	</Field>

	{#if d.bloodPressureResponse === 'hypotensive'}
		<Alert type="error" heading="Exertional hypotension selected">
			<p>
				A hypotensive (exertional) blood-pressure response is a critical result. It auto-escalates
				the follow-up urgency to a critical alert; communicate the result to the referrer on
				sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
