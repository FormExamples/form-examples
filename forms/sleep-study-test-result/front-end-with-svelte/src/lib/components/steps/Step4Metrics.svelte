<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Metrics">
	<p class="hint">Recording and sleep time, AHI, ODI, SpO2 metrics, and mean heart rate.</p>

	<Field
		label="Total recording time (hours)"
		inputId="totalRecordingTimeHours"
		description="Total recording time in hours."
	>
		<NumberInput
			id="totalRecordingTimeHours"
			label="Total recording time (hours)"
			min={0}
			max={24}
			step={0.1}
			bind:value={d.totalRecordingTimeHours}
		/>
	</Field>

	<Field
		label="Total sleep time (hours)"
		inputId="totalSleepTimeHours"
		description="Total sleep time in hours (for attended PSG with sleep staging)."
	>
		<NumberInput
			id="totalSleepTimeHours"
			label="Total sleep time (hours)"
			min={0}
			max={24}
			step={0.1}
			bind:value={d.totalSleepTimeHours}
		/>
	</Field>

	<Field
		label="Apnoea-Hypopnoea Index — AHI (events/hour)"
		inputId="apnoeaHypopnoeaIndex"
		description="AASM bands: normal <5, mild 5 to <15, moderate 15 to <30, severe >=30."
	>
		<NumberInput
			id="apnoeaHypopnoeaIndex"
			label="Apnoea-Hypopnoea Index — AHI (events/hour)"
			min={0}
			max={200}
			step={0.1}
			bind:value={d.apnoeaHypopnoeaIndex}
		/>
	</Field>

	<Field
		label="Oxygen Desaturation Index — ODI (events/hour)"
		inputId="oxygenDesaturationIndex"
		description=">=3% (or >=4%) desaturations per hour."
	>
		<NumberInput
			id="oxygenDesaturationIndex"
			label="Oxygen Desaturation Index — ODI (events/hour)"
			min={0}
			max={200}
			step={0.1}
			bind:value={d.oxygenDesaturationIndex}
		/>
	</Field>

	<Field
		label="Minimum SpO2 (%)"
		inputId="minimumSpo2Percent"
		description="Lowest (nadir) oxygen saturation recorded."
	>
		<NumberInput
			id="minimumSpo2Percent"
			label="Minimum SpO2 (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.minimumSpo2Percent}
		/>
	</Field>

	<Field
		label="Time below 90% SpO2 — T90 (%)"
		inputId="timeBelow90PercentSpo2"
		description="Percentage of time with SpO2 below 90%."
	>
		<NumberInput
			id="timeBelow90PercentSpo2"
			label="Time below 90% SpO2 — T90 (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.timeBelow90PercentSpo2}
		/>
	</Field>

	<Field
		label="Mean heart rate (bpm)"
		inputId="meanHeartRateBpm"
		description="Mean heart rate during the study."
	>
		<NumberInput
			id="meanHeartRateBpm"
			label="Mean heart rate (bpm)"
			min={0}
			max={300}
			step={1}
			bind:value={d.meanHeartRateBpm}
		/>
	</Field>
</Fieldset>
