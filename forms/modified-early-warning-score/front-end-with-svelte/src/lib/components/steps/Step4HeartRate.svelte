<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/mews-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const hr = assessment.data.heartRate;
	const points = $derived(computeSubscores(assessment.data).heartRate);
</script>

<Fieldset legend="Step 4 of 8 — Heart rate">
	<p class="hint">
		Parameter 2 — beats per minute. Scores 3 (&ge; 130), 2 (&le; 40 or 111-129), 1 (41-50 or
		101-110), or 0 (51-100).
	</p>

	<Field label="Measured heart rate (bpm)" inputId="heartRate-heartRate">
		<NumberInput
			id="heartRate-heartRate"
			label="Measured heart rate"
			min={0}
			max={300}
			step={1}
			bind:value={hr.heartRate}
		/>
	</Field>

	<Field label="Heart rate subscore">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}">
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
