<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const r = assessment.data.renal;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 8 — Creatinine and dialysis">
	<p class="hint">
		Calculation input 3 — serum creatinine, with the dialysis rule. umol/L values are converted to
		mg/dL (÷ 88.4). Creatinine is floored to 1.0 and capped at 4.0 mg/dL. If the patient had &ge; 2
		haemodialysis sessions in the past week, or &ge; 24 h of CVVHD, creatinine is set to 4.0 mg/dL.
	</p>

	<Field label="Serum creatinine" inputId="renal-creatinine">
		<NumberInput
			id="renal-creatinine"
			label="Serum creatinine"
			min={0}
			max={2000}
			step={0.1}
			bind:value={r.creatinine}
		/>
	</Field>

	<Field label="Creatinine unit" required inputId="renal-creatinineUnit">
		<Select id="renal-creatinineUnit" label="Creatinine unit" required bind:value={r.creatinineUnit}>
			<option value="">— Select —</option>
			<option value="mg/dL">mg/dL</option>
			<option value="umol/L">umol/L</option>
		</Select>
	</Field>

	<Field
		label="Haemodialysis sessions in the past 7 days"
		description="Two or more sessions triggers the dialysis creatinine rule."
		inputId="renal-dialysisSessionsPastWeek"
	>
		<NumberInput
			id="renal-dialysisSessionsPastWeek"
			label="Haemodialysis sessions in the past 7 days"
			min={0}
			max={21}
			step={1}
			bind:value={r.dialysisSessionsPastWeek}
		/>
	</Field>

	<Field label="Continuous veno-venous haemodialysis (CVVHD) &ge; 24 h in the past 7 days?">
		<RadioGroup label="CVVHD ≥ 24 h in the past 7 days?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="renal-cvvhd24h"
						value={opt.value}
						bind:group={r.cvvhd24h}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
