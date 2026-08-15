<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const d = assessment.data.hemoglobinopathyScreening;

	const screenOptions = [
		{ value: 'negative', label: 'Negative' },
		{ value: 'positive', label: 'Positive' },
		{ value: 'notPerformed', label: 'Not Performed' }
	];
</script>

<Fieldset legend="Hemoglobinopathy Screening">
	<p class="hint">Enter hemoglobinopathy screening and genetic testing results</p>
	<Field label="Hemoglobin Electrophoresis" inputId="hemoglobinElectrophoresis"><TextAreaInput id="hemoglobinElectrophoresis" label="Hemoglobin Electrophoresis" placeholder="e.g. HbA 97%, HbA2 2.5%, HbF 0.5%" bind:value={d.hemoglobinElectrophoresis} /></Field>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="Sickle Cell Screen" inputId="sickleCellScreen"><Select id="sickleCellScreen" label="Sickle Cell Screen" bind:value={d.sickleCellScreen}><option value="">-- Select --</option>{#each screenOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
		<Field label="Thalassemia Screen" inputId="thalassemiaScreen"><Select id="thalassemiaScreen" label="Thalassemia Screen" bind:value={d.thalassemiaScreen}><option value="">-- Select --</option>{#each screenOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	</div>

	<Field label="HPLC Results" inputId="hplcResults"><TextAreaInput id="hplcResults" label="HPLC Results" rows={2} placeholder="e.g. Normal pattern, no variant hemoglobins detected" bind:value={d.hplcResults} /></Field>
	<Field label="Genetic Testing Notes" inputId="geneticTestingNotes"><TextAreaInput id="geneticTestingNotes" label="Genetic Testing Notes" rows={2} placeholder="Any relevant genetic testing findings" bind:value={d.geneticTestingNotes} /></Field>
</Fieldset>
