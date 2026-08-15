<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { DUKE_HIGH_RISK_MAX } from '#lib/engine/utils.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Prognostic Score">
	<p class="hint">The Duke treadmill prognostic score and comparison with previous tests.</p>

	<Field
		label="Duke treadmill score"
		inputId="dukeTreadmillScore"
		description="DTS = exercise minutes − (5 × ST deviation mm) − (4 × angina index). Range about −25 (highest risk) to +15 (lowest risk). ≥+5 low risk, −10 to +4 intermediate, ≤−11 high risk."
	>
		<NumberInput
			id="dukeTreadmillScore"
			label="Duke treadmill score"
			min={-25}
			max={15}
			step={0.1}
			bind:value={d.dukeTreadmillScore}
		/>
	</Field>

	<Field label="Comparison with previous" inputId="comparisonWithPrevious">
		<TextAreaInput
			id="comparisonWithPrevious"
			label="Comparison with previous"
			rows={3}
			placeholder="Relevant previous stress tests or imaging and changes since…"
			bind:value={d.comparisonWithPrevious}
		/>
	</Field>

	{#if d.dukeTreadmillScore !== null && d.dukeTreadmillScore <= DUKE_HIGH_RISK_MAX}
		<Alert type="error" heading="High-risk Duke treadmill score">
			<p>
				A Duke treadmill score of {DUKE_HIGH_RISK_MAX} or lower is a high-risk band and is treated as
				a critical result. It auto-escalates the follow-up urgency to a critical alert.
			</p>
		</Alert>
	{/if}
</Fieldset>
