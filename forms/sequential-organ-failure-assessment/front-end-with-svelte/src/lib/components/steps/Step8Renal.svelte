<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { scoreRenal } from '$lib/engine/sofa-rules';
	import { subScoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const r = assessment.data.renal;
	const sub = $derived(scoreRenal(assessment.data).score);
</script>

<Fieldset legend="Step 8 of 9 — Renal">
	<p class="hint">
		Creatinine (&micro;mol/L) and 24-hour urine output (mL/day). The higher band sets the sub-score.
		Creatinine: &lt; 110 = 0, 110-170 = 1, 171-299 = 2, 300-440 = 3, &gt; 440 = 4. Urine: &lt; 500
		mL/day = 3, &lt; 200 mL/day = 4.
	</p>

	<Field label="Creatinine (umol/L)" inputId="renal-creatinine">
		<NumberInput
			id="renal-creatinine"
			label="Creatinine (umol/L)"
			min={0}
			max={2000}
			step={1}
			bind:value={r.creatinine}
		/>
	</Field>

	<Field label="24-hour urine output (mL/day)" inputId="renal-urineOutput">
		<NumberInput
			id="renal-urineOutput"
			label="24-hour urine output (mL/day)"
			min={0}
			max={10000}
			step={10}
			bind:value={r.urineOutput}
		/>
	</Field>

	<Field label="Renal sub-score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subScoreColor(sub)}">
			{sub === null ? 'Not scored' : `Sub-score ${sub}`}
		</span>
	</Field>
</Fieldset>
