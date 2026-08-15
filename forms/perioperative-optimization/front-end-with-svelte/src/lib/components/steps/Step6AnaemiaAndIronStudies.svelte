<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="6. Anaemia and Iron Studies">
	<p class="hint">Domain 1. Triggers on haemoglobin below the sex threshold, or on iron studies independently — a normal haemoglobin does not clear the domain.</p>

	<Field label="Sample date" inputId="anaemia-bloodsSampleDate">
		<DateInput id="anaemia-bloodsSampleDate" label="Sample date" bind:value={d.anaemia.bloodsSampleDate} />
	</Field>
	<Field label="Haemoglobin (g/L)" inputId="anaemia-haemoglobinGPerL" description="Below 130 in men or 120 in women triggers the domain; below 80 defers surgery.">
		<NumberInput id="anaemia-haemoglobinGPerL" label="Haemoglobin (g/L)" step="0.1" bind:value={d.anaemia.haemoglobinGPerL} />
	</Field>
	<Field label="Mean cell volume (fL)" inputId="anaemia-meanCellVolumeFl">
		<NumberInput id="anaemia-meanCellVolumeFl" label="Mean cell volume (fL)" step="0.1" bind:value={d.anaemia.meanCellVolumeFl} />
	</Field>
	<Field label="Ferritin (µg/L)" inputId="anaemia-ferritinUgPerL" description="Below 30 indicates absolute iron deficiency.">
		<NumberInput id="anaemia-ferritinUgPerL" label="Ferritin (µg/L)" step="0.1" bind:value={d.anaemia.ferritinUgPerL} />
	</Field>
	<Field label="Transferrin saturation (%)" inputId="anaemia-transferrinSaturationPercent" description="Below 20 with a ferritin of 30 to 100 indicates functional iron deficiency.">
		<NumberInput id="anaemia-transferrinSaturationPercent" label="Transferrin saturation (%)" step="0.1" bind:value={d.anaemia.transferrinSaturationPercent} />
	</Field>
	<Field label="Vitamin B12 (ng/L)" inputId="anaemia-vitaminB12NgPerL">
		<NumberInput id="anaemia-vitaminB12NgPerL" label="Vitamin B12 (ng/L)" step="0.1" bind:value={d.anaemia.vitaminB12NgPerL} />
	</Field>
	<Field label="Folate (µg/L)" inputId="anaemia-folateUgPerL">
		<NumberInput id="anaemia-folateUgPerL" label="Folate (µg/L)" step="0.1" bind:value={d.anaemia.folateUgPerL} />
	</Field>
	<Field label="C-reactive protein (mg/L)" inputId="anaemia-cReactiveProteinMgPerL">
		<NumberInput id="anaemia-cReactiveProteinMgPerL" label="C-reactive protein (mg/L)" step="0.1" bind:value={d.anaemia.cReactiveProteinMgPerL} />
	</Field>
	<Field label="Creatinine (µmol/L)" inputId="anaemia-creatinineUmolPerL">
		<NumberInput id="anaemia-creatinineUmolPerL" label="Creatinine (µmol/L)" step="0.1" bind:value={d.anaemia.creatinineUmolPerL} />
	</Field>
	<Field label="eGFR (ml/min)" inputId="anaemia-egfrMlPerMin">
		<NumberInput id="anaemia-egfrMlPerMin" label="eGFR (ml/min)" step="0.1" bind:value={d.anaemia.egfrMlPerMin} />
	</Field>
	<Field label="Known or suspected cause" inputId="anaemia-anaemiaKnownCause">
		<TextInput id="anaemia-anaemiaKnownCause" label="Known or suspected cause" bind:value={d.anaemia.anaemiaKnownCause} />
	</Field>
	<Field label="Treatment started" inputId="anaemia-anaemiaTreatmentStarted">
		<Select id="anaemia-anaemiaTreatmentStarted" label="Treatment started" bind:value={d.anaemia.anaemiaTreatmentStarted}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Route" inputId="anaemia-anaemiaTreatmentRoute" description="The route sets the lead time: 4 weeks intravenous, 8 weeks oral.">
		<Select id="anaemia-anaemiaTreatmentRoute" label="Route" bind:value={d.anaemia.anaemiaTreatmentRoute}>
			<option value="">— Select —</option>
			{#each OPTIONS.anaemiaRoute as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Treatment start date" inputId="anaemia-anaemiaTreatmentStartDate">
		<DateInput id="anaemia-anaemiaTreatmentStartDate" label="Treatment start date" bind:value={d.anaemia.anaemiaTreatmentStartDate} />
	</Field>
	<Field label="Previous transfusion" inputId="anaemia-previousTransfusion">
		<Select id="anaemia-previousTransfusion" label="Previous transfusion" bind:value={d.anaemia.previousTransfusion}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Group and save done" inputId="anaemia-groupAndSaveDone">
		<Select id="anaemia-groupAndSaveDone" label="Group and save done" bind:value={d.anaemia.groupAndSaveDone}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Anaemia notes" inputId="anaemia-anaemiaNotes">
		<TextAreaInput id="anaemia-anaemiaNotes" label="Anaemia notes" rows={2} bind:value={d.anaemia.anaemiaNotes} />
	</Field>
</Fieldset>
