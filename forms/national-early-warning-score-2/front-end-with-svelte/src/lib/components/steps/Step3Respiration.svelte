<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/news2-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const r = assessment.data.respiration;
	const points = $derived(computeSubscores(assessment.data).respiratoryRate);
</script>

<Fieldset legend="Step 3 of 10 — Respiration rate">
	<p class="hint">
		Parameter 1 — breaths per minute. Scores 3 (&le; 8 or &ge; 25), 2 (21-24), 1 (9-11), or 0
		(12-20).
	</p>

	<Field
		label="Measured respiration rate (breaths/min)"
		inputId="respiration-respiratoryRate"
	>
		<NumberInput
			id="respiration-respiratoryRate"
			label="Measured respiration rate"
			min={0}
			max={80}
			step={1}
			bind:value={r.respiratoryRate}
		/>
	</Field>

	<Field label="Respiration subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}"
		>
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
