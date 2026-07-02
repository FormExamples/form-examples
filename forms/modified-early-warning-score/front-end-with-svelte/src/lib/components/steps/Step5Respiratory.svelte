<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/mews-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const r = assessment.data.respiratory;
	const points = $derived(computeSubscores(assessment.data).respiratoryRate);
</script>

<Fieldset legend="Step 5 of 8 — Respiratory rate">
	<p class="hint">
		Parameter 3 — breaths per minute. Scores 3 (&ge; 30), 2 (&lt; 9 or 21-29), 1 (15-20), or 0
		(9-14).
	</p>

	<Field label="Measured respiratory rate (breaths/min)" inputId="respiratory-respiratoryRate">
		<NumberInput
			id="respiratory-respiratoryRate"
			label="Measured respiratory rate"
			min={0}
			max={80}
			step={1}
			bind:value={r.respiratoryRate}
		/>
	</Field>

	<Field label="Respiratory rate subscore">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}">
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
