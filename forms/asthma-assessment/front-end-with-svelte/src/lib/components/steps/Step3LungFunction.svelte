<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculatePeakFlowPercent, fev1Severity } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const lf = assessment.data.lungFunction;

	$effect(() => {
		const pct = calculatePeakFlowPercent(lf.peakFlowCurrent, lf.peakFlowBest);
		assessment.data.lungFunction.peakFlowPercent = pct;
	});
</script>

<Fieldset legend="Lung Function">
	<p class="hint">Spirometry and peak flow measurements.</p>

	<Field label="FEV1 (% predicted)" inputId="fev1Percent" description={lf.fev1Percent !== null ? `Classification: ${fev1Severity(lf.fev1Percent)}` : undefined}>
		<NumberInput id="fev1Percent" label="FEV1 percent predicted" min={0} max={150} bind:value={lf.fev1Percent} />
	</Field>

	<Field label="FEV1/FVC Ratio" inputId="fev1Fvc">
		<NumberInput id="fev1Fvc" label="FEV1/FVC ratio" min={0} max={1} step={0.01} bind:value={lf.fev1Fvc} />
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Peak Flow — Personal Best (L/min)" inputId="peakFlowBest">
			<NumberInput id="peakFlowBest" label="Peak Flow Personal Best" min={0} max={900} bind:value={lf.peakFlowBest} />
		</Field>
		<Field label="Peak Flow — Current (L/min)" inputId="peakFlowCurrent">
			<NumberInput id="peakFlowCurrent" label="Peak Flow Current" min={0} max={900} bind:value={lf.peakFlowCurrent} />
		</Field>
		<Field label="Peak Flow %" description="Auto-calculated">
			{#if lf.peakFlowPercent !== null}
				<p class="pf-value">{lf.peakFlowPercent}% <span class="pf-cat">of personal best</span></p>
			{:else}
				<p class="pf-value pf-empty">—</p>
			{/if}
		</Field>
	</div>

	<Field label="Last Spirometry Date" inputId="spirometryDate">
		<DateInput id="spirometryDate" label="Last Spirometry Date" bind:value={lf.spirometryDate} />
	</Field>

	<Field label="Spirometry Notes" inputId="spirometryNotes">
		<TextAreaInput id="spirometryNotes" label="Spirometry Notes" rows={3} bind:value={lf.spirometryNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid { grid-template-columns: 1fr; }
	}
	.pf-value { margin: 0; font-weight: 500; }
	.pf-cat { color: var(--color-muted); font-weight: 400; }
	.pf-empty { color: var(--color-muted); }
</style>
