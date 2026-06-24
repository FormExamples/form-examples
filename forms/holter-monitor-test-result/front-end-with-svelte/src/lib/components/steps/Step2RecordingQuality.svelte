<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Recording Quality">
	<p class="hint">The analysable recording duration and how much of the recording was interpretable.</p>

	<Field
		label="Recording duration (hours)"
		inputId="recordingDurationHours"
		description="Total analysable recording duration in hours."
	>
		<NumberInput
			id="recordingDurationHours"
			label="Recording duration (hours)"
			min={0}
			max={10000}
			step={0.1}
			bind:value={d.recordingDurationHours}
		/>
	</Field>

	<Field
		label="Analysed (%)"
		inputId="analysedPercent"
		description="Percentage of the recording that was analysable / interpretable (0–100)."
	>
		<NumberInput
			id="analysedPercent"
			label="Analysed (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.analysedPercent}
		/>
	</Field>

	{#if d.analysedPercent !== null && d.analysedPercent < 50}
		<Alert type="warning" heading="Inadequate recording">
			<p>
				Less than 50% of the recording was analysable; the study may be classified as inconclusive.
				Consider repeating or extending the monitoring.
			</p>
		</Alert>
	{/if}
</Fieldset>
