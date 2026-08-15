<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const v = assessment.data.vitalSigns;
</script>

<Fieldset legend="Vital Signs">
	<p class="hint">Recorded by donor session staff before donation.</p>

	<Field label="Haemoglobin (g/dL)" inputId="hemoglobin">
		<NumberInput id="hemoglobin" label="Haemoglobin" min={5} max={25} step={0.1} bind:value={v.hemoglobin} />
	</Field>

	<div class="field-grid">
		<Field label="Systolic BP (mmHg)" inputId="systolicBp">
			<NumberInput id="systolicBp" label="Systolic BP" min={60} max={250} bind:value={v.systolicBp} />
		</Field>
		<Field label="Diastolic BP (mmHg)" inputId="diastolicBp">
			<NumberInput id="diastolicBp" label="Diastolic BP" min={30} max={150} bind:value={v.diastolicBp} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Pulse (bpm)" inputId="pulseBpm">
			<NumberInput id="pulseBpm" label="Pulse" min={30} max={200} bind:value={v.pulseBpm} />
		</Field>
		<Field label="Temperature (°C)" inputId="temperatureCelsius">
			<NumberInput id="temperatureCelsius" label="Temperature" min={33} max={42} step={0.1} bind:value={v.temperatureCelsius} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
