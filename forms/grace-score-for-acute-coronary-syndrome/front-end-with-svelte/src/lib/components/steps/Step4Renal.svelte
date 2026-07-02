<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGraceGrade } from '$lib/engine/grace-grader';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const r = assessment.data.renal;
	const grade = $derived(calculateGraceGrade(assessment.data));
</script>

<Fieldset legend="Step 4 of 7 — Renal function">
	<p class="hint">
		Serum creatinine (variable 4). Enter the value and its unit; µmol/L is normalised to mg/dL
		(divided by 88.4) before banding.
	</p>

	<Field label="Serum creatinine" inputId="renal-serumCreatinine">
		<NumberInput
			id="renal-serumCreatinine"
			label="Serum creatinine"
			min={0}
			max={2000}
			step={0.01}
			bind:value={r.serumCreatinine}
		/>
	</Field>

	<Field label="Creatinine unit" required inputId="renal-serumCreatinineUnit">
		<Select
			id="renal-serumCreatinineUnit"
			label="Creatinine unit"
			required
			bind:value={r.serumCreatinineUnit}
		>
			<option value="">— Select —</option>
			<option value="mg/dL">mg/dL</option>
			<option value="umol/L">µmol/L</option>
		</Select>
	</Field>

	<Field label="Creatinine points">
		<span class="inline-block rounded-full border border-base-300 bg-base-300 px-3 py-1 text-sm font-bold text-base-content">
			{grade.creatininePoints} points
		</span>
	</Field>
</Fieldset>
