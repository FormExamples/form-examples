<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const p = assessment.data.pulmonaryFunction;
</script>

<Fieldset legend="Pulmonary Function">
	<p class="hint">Spirometry and gas transfer results (if available). Enter results as percentage of predicted values where applicable. Leave blank if not tested.</p>

	<div class="field-grid">
		<Field label="FEV1 (% predicted)" inputId="fev1">
			<NumberInput id="fev1" label="FEV1" min={0} max={150} bind:value={p.fev1} />
		</Field>
		<Field label="FVC (% predicted)" inputId="fvc">
			<NumberInput id="fvc" label="FVC" min={0} max={150} bind:value={p.fvc} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="FEV1/FVC Ratio (%)" inputId="fev1Fvc">
			<NumberInput id="fev1Fvc" label="FEV1/FVC" min={0} max={100} bind:value={p.fev1FvcRatio} />
		</Field>
		<Field label="DLCO (Gas Transfer, % predicted)" inputId="dlco">
			<NumberInput id="dlco" label="DLCO" min={0} max={150} bind:value={p.dlco} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="TLC (Total Lung Capacity, % predicted)" inputId="tlc">
			<NumberInput id="tlc" label="TLC" min={0} max={200} bind:value={p.tlc} />
		</Field>
		<Field label="Oxygen Saturation (SpO2, %)" inputId="spo2">
			<NumberInput id="spo2" label="SpO2" min={50} max={100} bind:value={p.oxygenSaturation} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
