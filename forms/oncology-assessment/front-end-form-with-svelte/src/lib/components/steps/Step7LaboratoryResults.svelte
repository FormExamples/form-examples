<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const lab = assessment.data.laboratoryResults;
</script>

<Fieldset legend="Complete Blood Count">
	<div class="field-grid">
		<Field label="WBC (x10^9/L)" inputId="wbc"><NumberInput id="wbc" label="WBC" min={0} max={100} step={0.1} bind:value={lab.wbc} /></Field>
		<Field label="Haemoglobin (g/L)" inputId="haemoglobin"><NumberInput id="haemoglobin" label="Haemoglobin" min={0} max={250} step={1} bind:value={lab.haemoglobin} /></Field>
		<Field label="Platelets (x10^9/L)" inputId="platelets"><NumberInput id="platelets" label="Platelets" min={0} max={1000} step={1} bind:value={lab.platelets} /></Field>
		<Field label="Neutrophils ANC (x10^9/L)" inputId="neutrophils"><NumberInput id="neutrophils" label="Neutrophils" min={0} max={50} step={0.1} bind:value={lab.neutrophils} /></Field>
	</div>
</Fieldset>

<Fieldset legend="Metabolic Panel">
	<div class="field-grid">
		<Field label="Creatinine (umol/L)" inputId="creatinine"><NumberInput id="creatinine" label="Creatinine" min={0} max={1500} step={1} bind:value={lab.creatinine} /></Field>
		<Field label="ALT (U/L)" inputId="alt"><NumberInput id="alt" label="ALT" min={0} max={5000} step={1} bind:value={lab.alt} /></Field>
		<Field label="AST (U/L)" inputId="ast"><NumberInput id="ast" label="AST" min={0} max={5000} step={1} bind:value={lab.ast} /></Field>
		<Field label="Bilirubin (umol/L)" inputId="bilirubin"><NumberInput id="bilirubin" label="Bilirubin" min={0} max={500} step={1} bind:value={lab.bilirubin} /></Field>
		<Field label="Albumin (g/L)" inputId="albumin"><NumberInput id="albumin" label="Albumin" min={0} max={60} step={1} bind:value={lab.albumin} /></Field>
		<Field label="Calcium (mmol/L)" inputId="calcium"><NumberInput id="calcium" label="Calcium" min={0} max={5} step={0.01} bind:value={lab.calcium} /></Field>
	</div>
</Fieldset>

<Fieldset legend="Other">
	<div class="field-grid">
		<Field label="LDH (U/L)" inputId="ldh"><NumberInput id="ldh" label="LDH" min={0} max={5000} step={1} bind:value={lab.ldh} /></Field>
		<Field label="INR" inputId="inr"><NumberInput id="inr" label="INR" min={0} max={10} step={0.1} bind:value={lab.inr} /></Field>
	</div>
</Fieldset>

<Fieldset legend="Tumour Markers">
	<div class="field-grid">
		<Field label="Tumour Marker" inputId="tumourMarker"><TextInput id="tumourMarker" label="Tumour Marker" placeholder="e.g., CA-125, PSA, CEA" bind:value={lab.tumourMarker} /></Field>
		<Field label="Value" inputId="tumourMarkerValue"><TextInput id="tumourMarkerValue" label="Tumour marker value" placeholder="e.g., 45 U/mL" bind:value={lab.tumourMarkerValue} /></Field>
	</div>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
