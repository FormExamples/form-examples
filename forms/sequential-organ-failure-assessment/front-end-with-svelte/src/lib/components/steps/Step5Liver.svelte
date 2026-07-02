<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { scoreLiver } from '$lib/engine/sofa-rules';
	import { subScoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const l = assessment.data.liver;
	const sub = $derived(scoreLiver(assessment.data).score);
</script>

<Fieldset legend="Step 5 of 9 — Liver">
	<p class="hint">
		Total bilirubin (&micro;mol/L). Bands: &lt; 20 = 0, 20-32 = 1, 33-101 = 2, 102-204 = 3, &gt; 204
		= 4.
	</p>

	<Field label="Total bilirubin (umol/L)" inputId="liver-bilirubin">
		<NumberInput
			id="liver-bilirubin"
			label="Total bilirubin (umol/L)"
			min={0}
			max={1000}
			step={1}
			bind:value={l.bilirubin}
		/>
	</Field>

	<Field label="Liver sub-score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subScoreColor(sub)}">
			{sub === null ? 'Not scored' : `Sub-score ${sub}`}
		</span>
	</Field>
</Fieldset>
