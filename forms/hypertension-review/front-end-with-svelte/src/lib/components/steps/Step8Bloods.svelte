<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const b = assessment.data.bloods;
</script>

<Fieldset legend="Step 8 of 12 — Bloods and investigations">
	<p class="hint">Annual U&amp;E, HbA1c, and lipids. Missing bloods raise a flag.</p>

	<Field label="Serum creatinine (µmol/L)" inputId="bloods-serumCreatinine">
		<NumberInput
			id="bloods-serumCreatinine"
			label="Serum creatinine (µmol/L)"
			min={10}
			max={2000}
			step={0.1}
			placeholder="e.g. 82"
			bind:value={b.serumCreatinine}
		/>
	</Field>

	<Field label="eGFR (mL/min/1.73m²)" inputId="bloods-egfr">
		<NumberInput
			id="bloods-egfr"
			label="eGFR (mL/min/1.73m²)"
			min={1}
			max={200}
			step={0.1}
			placeholder="e.g. 78"
			bind:value={b.egfr}
		/>
	</Field>

	<Field label="Serum potassium (mmol/L)" inputId="bloods-serumPotassium">
		<NumberInput
			id="bloods-serumPotassium"
			label="Serum potassium (mmol/L)"
			min={1}
			max={10}
			step={0.1}
			placeholder="e.g. 4.2"
			bind:value={b.serumPotassium}
		/>
	</Field>

	<Field label="HbA1c (mmol/mol)" inputId="bloods-hba1c">
		<NumberInput
			id="bloods-hba1c"
			label="HbA1c (mmol/mol)"
			min={10}
			max={200}
			step={0.1}
			placeholder="e.g. 41"
			bind:value={b.hba1c}
		/>
	</Field>

	<Field label="Total cholesterol (mmol/L)" inputId="bloods-totalCholesterol">
		<NumberInput
			id="bloods-totalCholesterol"
			label="Total cholesterol (mmol/L)"
			min={1}
			max={20}
			step={0.1}
			placeholder="e.g. 5.1"
			bind:value={b.totalCholesterol}
		/>
	</Field>

	<Field label="HDL cholesterol (mmol/L)" inputId="bloods-hdlCholesterol">
		<NumberInput
			id="bloods-hdlCholesterol"
			label="HDL cholesterol (mmol/L)"
			min={0.1}
			max={10}
			step={0.1}
			placeholder="e.g. 1.3"
			bind:value={b.hdlCholesterol}
		/>
	</Field>
</Fieldset>
