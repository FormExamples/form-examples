<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/news2-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const p = assessment.data.pulse;
	const points = $derived(computeSubscores(assessment.data).pulse);
</script>

<Fieldset legend="Step 7 of 10 — Pulse">
	<p class="hint">
		Parameter 5 — beats per minute. Scores 3 (&le; 40 or &ge; 131), 2 (111-130), 1 (41-50 or
		91-110), or 0 (51-90).
	</p>

	<Field label="Measured pulse rate (beats/min)" inputId="pulse-pulse">
		<NumberInput
			id="pulse-pulse"
			label="Measured pulse rate"
			min={20}
			max={250}
			step={1}
			bind:value={p.pulse}
		/>
	</Field>

	<Field label="Pulse subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}"
		>
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
