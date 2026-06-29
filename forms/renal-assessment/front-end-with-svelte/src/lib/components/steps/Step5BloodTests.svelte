<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { estimateEgfrCkdEpi2021, classifyGfrCategory } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const b = assessment.data.bloodTests;
	const demo = assessment.data.demographics;

	// Auto eGFR from creatinine + age + sex when no explicit eGFR is entered.
	const computedEgfr = $derived(
		b.egfr == null
			? estimateEgfrCkdEpi2021(b.serumCreatinine, demo.age, demo.sex)
			: null
	);
</script>

<Fieldset legend="Blood Tests">
	<p class="hint">
		Recent renal-function panel and related labs. eGFR auto-calculates from creatinine + age + sex
		(CKD-EPI 2021) if not entered directly.
	</p>

	<div class="field-grid field-grid-3">
		<Field label="Serum creatinine (mg/dL)" inputId="serumCreatinine">
			<NumberInput id="serumCreatinine" label="Serum creatinine" min={0} max={30} step={0.01} bind:value={b.serumCreatinine} />
		</Field>
		<Field label="eGFR entered (mL/min/1.73 m²)" inputId="egfr">
			<NumberInput id="egfr" label="eGFR entered" min={0} max={200} step={0.1} bind:value={b.egfr} />
		</Field>
		<Field label="eGFR computed" description="Auto from creatinine">
			{#if computedEgfr != null}
				<p class="readout">{computedEgfr} <span class="readout-muted">{classifyGfrCategory(computedEgfr)}</span></p>
			{:else}
				<p class="readout readout-empty">—</p>
			{/if}
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="BUN / urea (mg/dL)" inputId="bun">
			<NumberInput id="bun" label="BUN / urea" min={0} max={200} step={0.1} bind:value={b.bun} />
		</Field>
		<Field label="Sodium (mmol/L)" inputId="sodium">
			<NumberInput id="sodium" label="Sodium" min={100} max={180} step={0.1} bind:value={b.sodium} />
		</Field>
		<Field label="Potassium (mmol/L)" inputId="potassium">
			<NumberInput id="potassium" label="Potassium" min={1} max={10} step={0.1} bind:value={b.potassium} />
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="Chloride (mmol/L)" inputId="chloride">
			<NumberInput id="chloride" label="Chloride" min={60} max={140} step={0.1} bind:value={b.chloride} />
		</Field>
		<Field label="Bicarbonate (mmol/L)" inputId="bicarbonate">
			<NumberInput id="bicarbonate" label="Bicarbonate" min={5} max={50} step={0.1} bind:value={b.bicarbonate} />
		</Field>
		<Field label="Albumin (g/L)" inputId="albumin">
			<NumberInput id="albumin" label="Albumin" min={0} max={60} step={0.1} bind:value={b.albumin} />
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="Calcium (mmol/L)" inputId="calcium">
			<NumberInput id="calcium" label="Calcium" min={1} max={4} step={0.01} bind:value={b.calcium} />
		</Field>
		<Field label="Phosphate (mmol/L)" inputId="phosphate">
			<NumberInput id="phosphate" label="Phosphate" min={0} max={5} step={0.01} bind:value={b.phosphate} />
		</Field>
		<Field label="Magnesium (mmol/L)" inputId="magnesium">
			<NumberInput id="magnesium" label="Magnesium" min={0} max={5} step={0.01} bind:value={b.magnesium} />
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="Hemoglobin (g/L)" inputId="hemoglobin">
			<NumberInput id="hemoglobin" label="Hemoglobin" min={30} max={250} bind:value={b.hemoglobin} />
		</Field>
		<Field label="HbA1c (%)" inputId="hba1c">
			<NumberInput id="hba1c" label="HbA1c" min={3} max={20} step={0.1} bind:value={b.hba1c} />
		</Field>
		<Field label="PTH (pg/mL)" inputId="pth">
			<NumberInput id="pth" label="PTH" min={0} max={5000} bind:value={b.pth} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Vitamin D 25-OH (ng/mL)" inputId="vitaminD">
			<NumberInput id="vitaminD" label="Vitamin D" min={0} max={200} bind:value={b.vitaminD} />
		</Field>
		<Field label="Test date" inputId="bloodTestDate">
			<DateInput id="bloodTestDate" label="Test date" bind:value={b.testDate} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
	.readout {
		margin: 0;
		font-weight: 500;
	}
	.readout-muted {
		color: var(--color-muted);
		font-weight: 400;
	}
	.readout-empty {
		color: var(--color-muted);
	}
</style>
