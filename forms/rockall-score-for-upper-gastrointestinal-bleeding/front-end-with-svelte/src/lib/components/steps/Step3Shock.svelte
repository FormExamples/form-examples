<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { shockPoints } from '#lib/engine/rockall-rules.js';
	import { shockLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const s = assessment.data.shock;
	const point = $derived(shockPoints(assessment.data));
</script>

<Fieldset legend="Step 3 of 6 — Shock (vital signs)">
	<p class="hint">
		Shock is derived from two vital signs. Hypotension (systolic BP &lt; 100 mmHg) scores 2 and takes
		precedence over tachycardia (heart rate &ge; 100 bpm) which scores 1; otherwise 0.
	</p>

	<Field
		label="Heart rate (bpm)"
		description="Tachycardia (&ge; 100 bpm) scores 1 point when the patient is not hypotensive."
		inputId="shock-heartRate"
	>
		<NumberInput
			id="shock-heartRate"
			label="Heart rate"
			min={0}
			max={300}
			step={1}
			bind:value={s.heartRate}
		/>
	</Field>

	<Field
		label="Systolic blood pressure (mmHg)"
		description="Hypotension (&lt; 100 mmHg) scores 2 points and takes precedence."
		inputId="shock-systolicBloodPressure"
	>
		<NumberInput
			id="shock-systolicBloodPressure"
			label="Systolic blood pressure"
			min={0}
			max={300}
			step={1}
			bind:value={s.systolicBloodPressure}
		/>
	</Field>

	<Field label="Shock parameter points">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{point} pt</strong>
			<span class="text-sm text-base-content/70">{shockLabel(point)}</span>
		</span>
	</Field>
</Fieldset>
