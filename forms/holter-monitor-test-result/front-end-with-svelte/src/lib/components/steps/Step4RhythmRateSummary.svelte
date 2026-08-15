<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { SIGNIFICANT_PAUSE_SECONDS } from '#lib/engine/utils.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Rhythm & Rate Summary">
	<p class="hint">The predominant rhythm, heart-rate summary, longest pause, and ectopy burden.</p>

	<Field label="Predominant rhythm" inputId="predominantRhythm">
		<Select id="predominantRhythm" label="Predominant rhythm" bind:value={d.predominantRhythm}>
			<option value="">Select…</option>
			<option value="sinus">Sinus</option>
			<option value="atrial-fibrillation">Atrial fibrillation</option>
			<option value="paced">Paced</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Mean heart rate (bpm)" inputId="meanHeartRateBpm">
		<NumberInput
			id="meanHeartRateBpm"
			label="Mean heart rate (bpm)"
			min={0}
			max={400}
			step={1}
			bind:value={d.meanHeartRateBpm}
		/>
	</Field>

	<Field label="Minimum heart rate (bpm)" inputId="minimumHeartRateBpm">
		<NumberInput
			id="minimumHeartRateBpm"
			label="Minimum heart rate (bpm)"
			min={0}
			max={400}
			step={1}
			bind:value={d.minimumHeartRateBpm}
		/>
	</Field>

	<Field label="Maximum heart rate (bpm)" inputId="maximumHeartRateBpm">
		<NumberInput
			id="maximumHeartRateBpm"
			label="Maximum heart rate (bpm)"
			min={0}
			max={400}
			step={1}
			bind:value={d.maximumHeartRateBpm}
		/>
	</Field>

	<Field
		label="Longest pause (seconds)"
		inputId="longestPauseSeconds"
		description="Longest R-R pause in seconds; pauses > 3 seconds are clinically significant."
	>
		<NumberInput
			id="longestPauseSeconds"
			label="Longest pause (seconds)"
			min={0}
			max={600}
			step={0.01}
			bind:value={d.longestPauseSeconds}
		/>
	</Field>

	<Field
		label="Ventricular ectopic burden (%)"
		inputId="ventricularEctopicPercent"
		description="Ventricular ectopic (VE / PVC) burden as a percentage of total beats."
	>
		<NumberInput
			id="ventricularEctopicPercent"
			label="Ventricular ectopic burden (%)"
			min={0}
			max={100}
			step={0.01}
			bind:value={d.ventricularEctopicPercent}
		/>
	</Field>

	<Field
		label="Supraventricular ectopic burden (%)"
		inputId="supraventricularEctopicPercent"
		description="Supraventricular ectopic (SVE / PAC) burden as a percentage of total beats."
	>
		<NumberInput
			id="supraventricularEctopicPercent"
			label="Supraventricular ectopic burden (%)"
			min={0}
			max={100}
			step={0.01}
			bind:value={d.supraventricularEctopicPercent}
		/>
	</Field>

	{#if d.longestPauseSeconds !== null && d.longestPauseSeconds > SIGNIFICANT_PAUSE_SECONDS}
		<Alert type="error" heading="Significant pause">
			<p>
				A pause longer than {SIGNIFICANT_PAUSE_SECONDS} seconds is a critical finding and
				auto-escalates the follow-up urgency to a critical alert.
			</p>
		</Alert>
	{/if}
</Fieldset>
