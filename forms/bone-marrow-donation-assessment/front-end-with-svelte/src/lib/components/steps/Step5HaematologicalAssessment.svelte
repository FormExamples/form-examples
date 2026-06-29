<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.haematologicalAssessment;
</script>

<Fieldset legend="Haematological Assessment">
	<p class="hint">Full blood count and biochemistry results.</p>

	<div class="grid grid-3">
		<Field label="Haemoglobin (g/dL)" inputId="haemoglobin">
			<NumberInput id="haemoglobin" label="Haemoglobin" min={0} max={25} step={0.1} bind:value={d.haemoglobin} />
		</Field>
		<Field label="White Cell Count (×10⁹/L)" inputId="whiteCellCount">
			<NumberInput id="whiteCellCount" label="White Cell Count" min={0} max={100} step={0.1} bind:value={d.whiteCellCount} />
		</Field>
		<Field label="Platelet Count (×10⁹/L)" inputId="plateletCount">
			<NumberInput id="plateletCount" label="Platelet Count" min={0} max={1000} bind:value={d.plateletCount} />
		</Field>
		<Field label="Neutrophil Count (×10⁹/L)" inputId="neutrophilCount">
			<NumberInput id="neutrophilCount" label="Neutrophil Count" min={0} max={50} step={0.1} bind:value={d.neutrophilCount} />
		</Field>
		<Field label="Lymphocyte Count (×10⁹/L)" inputId="lymphocyteCount">
			<NumberInput id="lymphocyteCount" label="Lymphocyte Count" min={0} max={50} step={0.1} bind:value={d.lymphocyteCount} />
		</Field>
		<Field label="Haematocrit (%)" inputId="haematocrit">
			<NumberInput id="haematocrit" label="Haematocrit" min={0} max={70} step={0.1} bind:value={d.haematocrit} />
		</Field>
		<Field label="MCV (fL)" inputId="mcv">
			<NumberInput id="mcv" label="MCV" min={50} max={130} step={0.1} bind:value={d.mcv} />
		</Field>
		<Field label="Ferritin (µg/L)" inputId="ferritin">
			<NumberInput id="ferritin" label="Ferritin" min={0} max={2000} bind:value={d.ferritin} />
		</Field>
		<Field label="Creatinine (µmol/L)" inputId="creatinine">
			<NumberInput id="creatinine" label="Creatinine" min={0} max={1000} bind:value={d.creatinine} />
		</Field>
	</div>

	<div class="grid">
		<Field label="Blood Group" inputId="bloodGroup">
			<Select id="bloodGroup" label="Blood Group" bind:value={d.bloodGroup}>
				<option value="">Select…</option>
				<option value="A+">A+</option>
				<option value="A-">A-</option>
				<option value="B+">B+</option>
				<option value="B-">B-</option>
				<option value="AB+">AB+</option>
				<option value="AB-">AB-</option>
				<option value="O+">O+</option>
				<option value="O-">O-</option>
			</Select>
		</Field>
		<Field label="Coagulation Screen" inputId="coagulationScreen">
			<Select id="coagulationScreen" label="Coagulation Screen" bind:value={d.coagulationScreen}>
				<option value="">Select…</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
				<option value="pending">Pending</option>
			</Select>
		</Field>
		<Field label="Liver Function" inputId="liverFunction">
			<Select id="liverFunction" label="Liver Function" bind:value={d.liverFunction}>
				<option value="">Select…</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
				<option value="pending">Pending</option>
			</Select>
		</Field>
	</div>
</Fieldset>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.grid.grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.grid,
		.grid.grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
