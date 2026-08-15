<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Recording Details">
	<p class="hint">The performed recording type, duration, and technical quality.</p>

	<Field label="EEG type" inputId="eegType">
		<Select id="eegType" label="EEG type" bind:value={d.eegType}>
			<option value="">Select…</option>
			<option value="routine-awake">Routine awake</option>
			<option value="sleep-deprived">Sleep-deprived</option>
			<option value="ambulatory-24h">Ambulatory 24-hour</option>
			<option value="video-telemetry">Video telemetry</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Recording duration (minutes)"
		inputId="recordingDurationMinutes"
		description="Total EEG recording duration in minutes."
	>
		<NumberInput
			id="recordingDurationMinutes"
			label="Recording duration (minutes)"
			min={0}
			max={100000}
			step={0.1}
			bind:value={d.recordingDurationMinutes}
		/>
	</Field>

	<Field label="Recording quality" inputId="recordingQuality">
		<Select id="recordingQuality" label="Recording quality" bind:value={d.recordingQuality}>
			<option value="">Select…</option>
			<option value="good">Good</option>
			<option value="adequate">Adequate</option>
			<option value="limited">Limited</option>
		</Select>
	</Field>
</Fieldset>
