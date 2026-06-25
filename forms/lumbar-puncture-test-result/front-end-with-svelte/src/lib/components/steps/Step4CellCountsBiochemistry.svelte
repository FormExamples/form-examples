<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Cell Counts & Biochemistry">
	<p class="hint">CSF cell counts and biochemistry, interpreted against standard reference ranges.</p>

	<Field
		label="White cell count (/µL)"
		inputId="csfWhiteCellCount"
		description="Normal adult typically < 5/µL; neutrophil predominance suggests bacterial infection."
	>
		<NumberInput
			id="csfWhiteCellCount"
			label="White cell count (/µL)"
			min={0}
			max={1000000}
			step={0.1}
			bind:value={d.csfWhiteCellCount}
		/>
	</Field>

	<Field
		label="Red cell count (/µL)"
		inputId="csfRedCellCount"
		description="Raised in a traumatic tap or subarachnoid haemorrhage."
	>
		<NumberInput
			id="csfRedCellCount"
			label="Red cell count (/µL)"
			min={0}
			max={100000000}
			step={0.1}
			bind:value={d.csfRedCellCount}
		/>
	</Field>

	<Field
		label="Protein (g/L)"
		inputId="csfProteinGL"
		description="Normal adult typically 0.15–0.45 g/L."
	>
		<NumberInput
			id="csfProteinGL"
			label="Protein (g/L)"
			min={0}
			max={100}
			step={0.01}
			bind:value={d.csfProteinGL}
		/>
	</Field>

	<Field
		label="Glucose (mmol/L)"
		inputId="csfGlucoseMmolL"
		description="Interpret against the paired serum glucose; low in bacterial meningitis."
	>
		<NumberInput
			id="csfGlucoseMmolL"
			label="Glucose (mmol/L)"
			min={0}
			max={50}
			step={0.01}
			bind:value={d.csfGlucoseMmolL}
		/>
	</Field>

	<Field
		label="CSF:serum glucose ratio"
		inputId="csfSerumGlucoseRatio"
		description="Normal approximately 0.6; < 0.4 suggests bacterial meningitis."
	>
		<NumberInput
			id="csfSerumGlucoseRatio"
			label="CSF:serum glucose ratio"
			min={0}
			max={2}
			step={0.01}
			bind:value={d.csfSerumGlucoseRatio}
		/>
	</Field>

	<Field
		label="Lactate (mmol/L)"
		inputId="csfLactateMmolL"
		description="Raised (typically > 3.5 mmol/L) supports bacterial meningitis."
	>
		<NumberInput
			id="csfLactateMmolL"
			label="Lactate (mmol/L)"
			min={0}
			max={50}
			step={0.01}
			bind:value={d.csfLactateMmolL}
		/>
	</Field>
</Fieldset>
