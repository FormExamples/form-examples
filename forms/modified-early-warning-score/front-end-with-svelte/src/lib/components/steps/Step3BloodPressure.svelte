<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/mews-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const bp = assessment.data.bloodPressure;
	const points = $derived(computeSubscores(assessment.data).systolicBloodPressure);
</script>

<Fieldset legend="Step 3 of 8 — Systolic blood pressure">
	<p class="hint">
		Parameter 1 — mmHg. Scores 3 (&le; 70), 2 (71-80 or &ge; 200), 1 (81-100), or 0 (101-199).
	</p>

	<Field label="Measured systolic blood pressure (mmHg)" inputId="bloodPressure-systolicBloodPressure">
		<NumberInput
			id="bloodPressure-systolicBloodPressure"
			label="Measured systolic blood pressure"
			min={0}
			max={300}
			step={1}
			bind:value={bp.systolicBloodPressure}
		/>
	</Field>

	<Field label="Blood pressure subscore">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}">
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
