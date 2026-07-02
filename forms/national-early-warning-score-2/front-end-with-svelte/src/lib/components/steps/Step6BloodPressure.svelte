<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/news2-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const b = assessment.data.bloodPressure;
	const points = $derived(computeSubscores(assessment.data).systolicBp);
</script>

<Fieldset legend="Step 6 of 10 — Systolic blood pressure">
	<p class="hint">
		Parameter 4 — mmHg. Scores 3 (&le; 90 or &ge; 220), 2 (91-100), 1 (101-110), or 0 (111-219).
	</p>

	<Field label="Systolic blood pressure (mmHg)" inputId="bloodPressure-systolicBloodPressure">
		<NumberInput
			id="bloodPressure-systolicBloodPressure"
			label="Systolic blood pressure"
			min={40}
			max={300}
			step={1}
			bind:value={b.systolicBloodPressure}
		/>
	</Field>

	<Field
		label="Diastolic blood pressure (mmHg)"
		description="Optional and unscored — recorded for completeness."
		inputId="bloodPressure-diastolicBloodPressure"
	>
		<NumberInput
			id="bloodPressure-diastolicBloodPressure"
			label="Diastolic blood pressure"
			min={20}
			max={200}
			step={1}
			bind:value={b.diastolicBloodPressure}
		/>
	</Field>

	<Field label="Blood-pressure subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}"
		>
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
