<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { scoreCoagulation } from '$lib/engine/sofa-rules';
	import { subScoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const c = assessment.data.coagulation;
	const sub = $derived(scoreCoagulation(assessment.data).score);
</script>

<Fieldset legend="Step 4 of 9 — Coagulation">
	<p class="hint">
		Platelet count (&times;10&#8313;/L). Bands: &ge; 150 = 0, &lt; 150 = 1, &lt; 100 = 2, &lt; 50 =
		3, &lt; 20 = 4.
	</p>

	<Field label="Platelet count (x10^9/L)" inputId="coagulation-platelets">
		<NumberInput
			id="coagulation-platelets"
			label="Platelet count (x10^9/L)"
			min={0}
			max={1500}
			step={1}
			bind:value={c.platelets}
		/>
	</Field>

	<Field label="Coagulation sub-score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subScoreColor(sub)}">
			{sub === null ? 'Not scored' : `Sub-score ${sub}`}
		</span>
	</Field>
</Fieldset>
