<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const b = assessment.data.bloods;
</script>

<Fieldset legend="Step 7 of 8 — Metabolic bloods">
	<p class="hint">
		Potassium, haemoglobin, and CKD-MBD markers. Potassium and haemoglobin are the core bundle
		bloods.
	</p>

	<Field label="HbA1c (mmol/mol)" inputId="bloods-hba1c">
		<NumberInput
			id="bloods-hba1c"
			label="HbA1c (mmol/mol)"
			min={10}
			max={200}
			step={0.1}
			placeholder="e.g. 52"
			bind:value={b.hba1c}
		/>
	</Field>

	<Field
		label="Potassium (mmol/L)"
		description="&ge; 6.0 raises a high-priority hyperkalaemia flag; 5.5–5.9 medium."
		inputId="bloods-potassium"
	>
		<NumberInput
			id="bloods-potassium"
			label="Potassium (mmol/L)"
			min={1}
			max={10}
			step={0.1}
			placeholder="e.g. 4.6"
			bind:value={b.potassium}
		/>
	</Field>

	<Field label="Bicarbonate (mmol/L)" inputId="bloods-bicarbonate">
		<NumberInput
			id="bloods-bicarbonate"
			label="Bicarbonate (mmol/L)"
			min={1}
			max={50}
			step={0.1}
			placeholder="e.g. 24"
			bind:value={b.bicarbonate}
		/>
	</Field>

	<Field label="Calcium (mmol/L)" inputId="bloods-calcium">
		<NumberInput
			id="bloods-calcium"
			label="Calcium (mmol/L)"
			min={1}
			max={5}
			step={0.01}
			placeholder="e.g. 2.35"
			bind:value={b.calcium}
		/>
	</Field>

	<Field label="Phosphate (mmol/L)" inputId="bloods-phosphate">
		<NumberInput
			id="bloods-phosphate"
			label="Phosphate (mmol/L)"
			min={0.1}
			max={5}
			step={0.01}
			placeholder="e.g. 1.10"
			bind:value={b.phosphate}
		/>
	</Field>

	<Field label="PTH (pmol/L)" inputId="bloods-pth">
		<NumberInput
			id="bloods-pth"
			label="PTH (pmol/L)"
			min={0}
			max={200}
			step={0.1}
			placeholder="e.g. 7.2"
			bind:value={b.pth}
		/>
	</Field>

	<Field
		label="Haemoglobin (g/L)"
		description="&lt; 110 raises an anaemia-of-CKD flag."
		inputId="bloods-haemoglobin"
	>
		<NumberInput
			id="bloods-haemoglobin"
			label="Haemoglobin (g/L)"
			min={20}
			max={250}
			step={1}
			placeholder="e.g. 132"
			bind:value={b.haemoglobin}
		/>
	</Field>
</Fieldset>
