<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="6. Biochemistry and Clinical Monitoring">
	<p class="hint">Recent blood results. Leave blank where a result is unavailable; a missing electrolyte panel raises the refeeding flag rather than clearing it.</p>

	<Field label="Sample date" inputId="biochemistry-bloodsSampleDate">
		<DateInput id="biochemistry-bloodsSampleDate" label="Sample date" bind:value={d.biochemistry.bloodsSampleDate} />
	</Field>
	<Field label="Albumin (g/L)" inputId="biochemistry-albuminGPerL" description="A marker of inflammation, not of protein intake.">
		<NumberInput id="biochemistry-albuminGPerL" label="Albumin (g/L)" step="0.1" bind:value={d.biochemistry.albuminGPerL} />
	</Field>
	<Field label="C-reactive protein (mg/L)" inputId="biochemistry-cReactiveProteinMgPerL">
		<NumberInput id="biochemistry-cReactiveProteinMgPerL" label="C-reactive protein (mg/L)" step="0.1" bind:value={d.biochemistry.cReactiveProteinMgPerL} />
	</Field>
	<Field label="Haemoglobin (g/L)" inputId="biochemistry-haemoglobinGPerL">
		<NumberInput id="biochemistry-haemoglobinGPerL" label="Haemoglobin (g/L)" step="0.1" bind:value={d.biochemistry.haemoglobinGPerL} />
	</Field>
	<Field label="Ferritin (µg/L)" inputId="biochemistry-ferritinUgPerL">
		<NumberInput id="biochemistry-ferritinUgPerL" label="Ferritin (µg/L)" step="0.1" bind:value={d.biochemistry.ferritinUgPerL} />
	</Field>
	<Field label="Vitamin B12 (ng/L)" inputId="biochemistry-vitaminB12NgPerL">
		<NumberInput id="biochemistry-vitaminB12NgPerL" label="Vitamin B12 (ng/L)" step="0.1" bind:value={d.biochemistry.vitaminB12NgPerL} />
	</Field>
	<Field label="Folate (µg/L)" inputId="biochemistry-folateUgPerL">
		<NumberInput id="biochemistry-folateUgPerL" label="Folate (µg/L)" step="0.1" bind:value={d.biochemistry.folateUgPerL} />
	</Field>
	<Field label="Vitamin D (nmol/L)" inputId="biochemistry-vitaminDNmolPerL">
		<NumberInput id="biochemistry-vitaminDNmolPerL" label="Vitamin D (nmol/L)" step="0.1" bind:value={d.biochemistry.vitaminDNmolPerL} />
	</Field>
	<Field label="HbA1c (mmol/mol)" inputId="biochemistry-hba1cMmolPerMol">
		<NumberInput id="biochemistry-hba1cMmolPerMol" label="HbA1c (mmol/mol)" step="0.1" bind:value={d.biochemistry.hba1cMmolPerMol} />
	</Field>
	<Field label="Sodium (mmol/L)" inputId="biochemistry-sodiumMmolPerL">
		<NumberInput id="biochemistry-sodiumMmolPerL" label="Sodium (mmol/L)" step="0.1" bind:value={d.biochemistry.sodiumMmolPerL} />
	</Field>
	<Field label="Potassium (mmol/L)" inputId="biochemistry-potassiumMmolPerL">
		<NumberInput id="biochemistry-potassiumMmolPerL" label="Potassium (mmol/L)" step="0.1" bind:value={d.biochemistry.potassiumMmolPerL} />
	</Field>
	<Field label="Magnesium (mmol/L)" inputId="biochemistry-magnesiumMmolPerL">
		<NumberInput id="biochemistry-magnesiumMmolPerL" label="Magnesium (mmol/L)" step="0.01" bind:value={d.biochemistry.magnesiumMmolPerL} />
	</Field>
	<Field label="Phosphate (mmol/L)" inputId="biochemistry-phosphateMmolPerL">
		<NumberInput id="biochemistry-phosphateMmolPerL" label="Phosphate (mmol/L)" step="0.01" bind:value={d.biochemistry.phosphateMmolPerL} />
	</Field>
	<Field label="Corrected calcium (mmol/L)" inputId="biochemistry-correctedCalciumMmolPerL">
		<NumberInput id="biochemistry-correctedCalciumMmolPerL" label="Corrected calcium (mmol/L)" step="0.01" bind:value={d.biochemistry.correctedCalciumMmolPerL} />
	</Field>
	<Field label="Urea (mmol/L)" inputId="biochemistry-ureaMmolPerL">
		<NumberInput id="biochemistry-ureaMmolPerL" label="Urea (mmol/L)" step="0.1" bind:value={d.biochemistry.ureaMmolPerL} />
	</Field>
	<Field label="Creatinine (µmol/L)" inputId="biochemistry-creatinineUmolPerL">
		<NumberInput id="biochemistry-creatinineUmolPerL" label="Creatinine (µmol/L)" step="0.1" bind:value={d.biochemistry.creatinineUmolPerL} />
	</Field>
	<Field label="eGFR (ml/min/1.73m²)" inputId="biochemistry-egfrMlPerMin">
		<NumberInput id="biochemistry-egfrMlPerMin" label="eGFR (ml/min/1.73m²)" step="0.1" bind:value={d.biochemistry.egfrMlPerMin} />
	</Field>
	<Field label="Alanine aminotransferase (U/L)" inputId="biochemistry-alanineAminotransferaseUPerL">
		<NumberInput id="biochemistry-alanineAminotransferaseUPerL" label="Alanine aminotransferase (U/L)" step="0.1" bind:value={d.biochemistry.alanineAminotransferaseUPerL} />
	</Field>
	<Field label="Bilirubin (µmol/L)" inputId="biochemistry-bilirubinUmolPerL">
		<NumberInput id="biochemistry-bilirubinUmolPerL" label="Bilirubin (µmol/L)" step="0.1" bind:value={d.biochemistry.bilirubinUmolPerL} />
	</Field>
	<Field label="Total cholesterol (mmol/L)" inputId="biochemistry-totalCholesterolMmolPerL">
		<NumberInput id="biochemistry-totalCholesterolMmolPerL" label="Total cholesterol (mmol/L)" step="0.1" bind:value={d.biochemistry.totalCholesterolMmolPerL} />
	</Field>
	<Field label="Triglycerides (mmol/L)" inputId="biochemistry-triglyceridesMmolPerL">
		<NumberInput id="biochemistry-triglyceridesMmolPerL" label="Triglycerides (mmol/L)" step="0.1" bind:value={d.biochemistry.triglyceridesMmolPerL} />
	</Field>
	<Field label="Biochemistry notes" inputId="biochemistry-biochemistryNotes">
		<TextAreaInput id="biochemistry-biochemistryNotes" label="Biochemistry notes" rows={2} bind:value={d.biochemistry.biochemistryNotes} />
	</Field>
</Fieldset>
