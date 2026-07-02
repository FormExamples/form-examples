<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const inv = assessment.data.investigations;
</script>

<Fieldset legend="Step 5 of 9 — Investigations">
	<p class="hint">Natriuretic peptide, U&amp;E and renal function, iron status, and glycaemic control.</p>

	<Field label="NT-proBNP (ng/L)" inputId="investigations-ntProBnp">
		<NumberInput
			id="investigations-ntProBnp"
			label="NT-proBNP (ng/L)"
			min={0}
			max={100000}
			step={1}
			bind:value={inv.ntProBnp}
		/>
	</Field>

	<Field label="Sodium (mmol/L)" inputId="investigations-sodium">
		<NumberInput
			id="investigations-sodium"
			label="Sodium (mmol/L)"
			min={100}
			max={180}
			step={0.1}
			bind:value={inv.sodium}
		/>
	</Field>

	<Field
		label="Potassium (mmol/L)"
		inputId="investigations-potassium"
		description="RAAS-inhibitor / MRA monitoring. Flags at over 5.5 (high) and under 3.5 (low)."
	>
		<NumberInput
			id="investigations-potassium"
			label="Potassium (mmol/L)"
			min={1}
			max={9}
			step={0.1}
			bind:value={inv.potassium}
		/>
	</Field>

	<Field label="Urea (mmol/L)" inputId="investigations-urea">
		<NumberInput
			id="investigations-urea"
			label="Urea (mmol/L)"
			min={0}
			max={60}
			step={0.1}
			bind:value={inv.urea}
		/>
	</Field>

	<Field label="Creatinine (µmol/L)" inputId="investigations-creatinine">
		<NumberInput
			id="investigations-creatinine"
			label="Creatinine (µmol/L)"
			min={0}
			max={2000}
			step={1}
			bind:value={inv.creatinine}
		/>
	</Field>

	<Field
		label="eGFR (mL/min/1.73m²)"
		inputId="investigations-egfr"
		description="Flags under 30 (significant renal impairment)."
	>
		<NumberInput
			id="investigations-egfr"
			label="eGFR (mL/min/1.73m²)"
			min={0}
			max={200}
			step={1}
			bind:value={inv.egfr}
		/>
	</Field>

	<Field label="Haemoglobin (g/L)" inputId="investigations-haemoglobin">
		<NumberInput
			id="investigations-haemoglobin"
			label="Haemoglobin (g/L)"
			min={30}
			max={250}
			step={1}
			bind:value={inv.haemoglobin}
		/>
	</Field>

	<Field label="Ferritin (µg/L)" inputId="investigations-ferritin">
		<NumberInput
			id="investigations-ferritin"
			label="Ferritin (µg/L)"
			min={0}
			max={5000}
			step={1}
			bind:value={inv.ferritin}
		/>
	</Field>

	<Field label="Transferrin saturation (%)" inputId="investigations-transferrinSaturation">
		<NumberInput
			id="investigations-transferrinSaturation"
			label="Transferrin saturation (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={inv.transferrinSaturation}
		/>
	</Field>

	<Field label="HbA1c (mmol/mol)" inputId="investigations-hba1c">
		<NumberInput
			id="investigations-hba1c"
			label="HbA1c (mmol/mol)"
			min={0}
			max={200}
			step={0.1}
			bind:value={inv.hba1c}
		/>
	</Field>

	<Field label="Date monitoring bloods taken" inputId="investigations-bloodsDate">
		<DateInput
			id="investigations-bloodsDate"
			label="Date monitoring bloods taken"
			bind:value={inv.bloodsDate}
		/>
	</Field>
</Fieldset>
