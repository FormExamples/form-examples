<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Result Values">
	<p class="hint">
		The quantitative analyte values the laboratory measured, grouped by panel. Leave an analyte
		blank when it was not measured.
	</p>

	<!-- Full blood count (FBC) -->
	<h3 class="mt-4 mb-2 text-sm font-semibold text-gray-700">Full blood count (FBC)</h3>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		<Field label="Haemoglobin (g/L)" inputId="haemoglobinGL">
			<NumberInput id="haemoglobinGL" label="Haemoglobin (g/L)" min={0} max={300} step={0.1} bind:value={d.haemoglobinGL} />
		</Field>
		<Field label="White cell count (×10⁹/L)" inputId="whiteCellCount">
			<NumberInput id="whiteCellCount" label="White cell count (x10^9/L)" min={0} max={500} step={0.01} bind:value={d.whiteCellCount} />
		</Field>
		<Field label="Platelets (×10⁹/L)" inputId="platelets">
			<NumberInput id="platelets" label="Platelets (x10^9/L)" min={0} max={5000} step={1} bind:value={d.platelets} />
		</Field>
		<Field label="Neutrophils (×10⁹/L)" inputId="neutrophils">
			<NumberInput id="neutrophils" label="Neutrophils (x10^9/L)" min={0} max={500} step={0.01} bind:value={d.neutrophils} />
		</Field>
	</div>

	<!-- Urea & electrolytes / renal (U&E) -->
	<h3 class="mt-4 mb-2 text-sm font-semibold text-gray-700">Urea & electrolytes / renal (U&E)</h3>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		<Field label="Sodium (mmol/L)" inputId="sodiumMmolL">
			<NumberInput id="sodiumMmolL" label="Sodium (mmol/L)" min={0} max={250} step={0.1} bind:value={d.sodiumMmolL} />
		</Field>
		<Field label="Potassium (mmol/L)" inputId="potassiumMmolL">
			<NumberInput id="potassiumMmolL" label="Potassium (mmol/L)" min={0} max={20} step={0.1} bind:value={d.potassiumMmolL} />
		</Field>
		<Field label="Urea (mmol/L)" inputId="ureaMmolL">
			<NumberInput id="ureaMmolL" label="Urea (mmol/L)" min={0} max={200} step={0.1} bind:value={d.ureaMmolL} />
		</Field>
		<Field label="Creatinine (µmol/L)" inputId="creatinineUmolL">
			<NumberInput id="creatinineUmolL" label="Creatinine (umol/L)" min={0} max={5000} step={1} bind:value={d.creatinineUmolL} />
		</Field>
		<Field label="eGFR (mL/min/1.73m²)" inputId="egfr">
			<NumberInput id="egfr" label="eGFR (mL/min/1.73m2)" min={0} max={200} step={1} bind:value={d.egfr} />
		</Field>
	</div>

	<!-- Liver function (LFT) -->
	<h3 class="mt-4 mb-2 text-sm font-semibold text-gray-700">Liver function (LFT)</h3>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		<Field label="ALT (U/L)" inputId="altUL">
			<NumberInput id="altUL" label="ALT (U/L)" min={0} max={20000} step={1} bind:value={d.altUL} />
		</Field>
		<Field label="Alkaline phosphatase (U/L)" inputId="alkalinePhosphatase">
			<NumberInput id="alkalinePhosphatase" label="Alkaline phosphatase (U/L)" min={0} max={20000} step={1} bind:value={d.alkalinePhosphatase} />
		</Field>
		<Field label="Bilirubin (µmol/L)" inputId="bilirubinUmolL">
			<NumberInput id="bilirubinUmolL" label="Bilirubin (umol/L)" min={0} max={2000} step={1} bind:value={d.bilirubinUmolL} />
		</Field>
		<Field label="Albumin (g/L)" inputId="albuminGL">
			<NumberInput id="albuminGL" label="Albumin (g/L)" min={0} max={100} step={1} bind:value={d.albuminGL} />
		</Field>
	</div>

	<!-- Inflammation, glycaemic, endocrine, haematinics, coagulation -->
	<h3 class="mt-4 mb-2 text-sm font-semibold text-gray-700">
		Inflammation, glycaemic, endocrine, haematinics, coagulation
	</h3>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		<Field label="C-reactive protein (mg/L)" inputId="cReactiveProtein">
			<NumberInput id="cReactiveProtein" label="C-reactive protein (mg/L)" min={0} max={1000} step={0.1} bind:value={d.cReactiveProtein} />
		</Field>
		<Field label="HbA1c (mmol/mol)" inputId="hba1cMmolMol">
			<NumberInput id="hba1cMmolMol" label="HbA1c (mmol/mol)" min={0} max={250} step={1} bind:value={d.hba1cMmolMol} />
		</Field>
		<Field label="Glucose (mmol/L)" inputId="glucoseMmolL">
			<NumberInput id="glucoseMmolL" label="Glucose (mmol/L)" min={0} max={100} step={0.1} bind:value={d.glucoseMmolL} />
		</Field>
		<Field label="TSH (mU/L)" inputId="tsh">
			<NumberInput id="tsh" label="TSH (mU/L)" min={0} max={1000} step={0.01} bind:value={d.tsh} />
		</Field>
		<Field label="Ferritin (µg/L)" inputId="ferritin">
			<NumberInput id="ferritin" label="Ferritin (ug/L)" min={0} max={100000} step={1} bind:value={d.ferritin} />
		</Field>
		<Field label="INR (ratio)" inputId="inr">
			<NumberInput id="inr" label="INR (ratio)" min={0} max={30} step={0.1} bind:value={d.inr} />
		</Field>
	</div>
</Fieldset>
