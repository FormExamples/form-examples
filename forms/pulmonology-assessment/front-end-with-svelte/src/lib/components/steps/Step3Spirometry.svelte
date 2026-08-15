<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.spirometry;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

	$effect(() => {
		if (s.fev1 !== null && s.fvc !== null && s.fvc > 0) {
			assessment.data.spirometry.fev1FvcRatio = Math.round((s.fev1 / s.fvc) * 100) / 100;
		}
	});

	const ratioDesc = $derived(
		s.fev1FvcRatio !== null
			? `${s.fev1FvcRatio} (${s.fev1FvcRatio < 0.7 ? 'Obstructive pattern' : 'Normal'})`
			: 'Auto-calculated from FEV1/FVC'
	);
</script>

<Fieldset legend="Spirometry Results">
	<p class="hint">Lung function test measurements.</p>

	<div class="field-grid">
		<Field label="FEV1 (litres)" inputId="fev1">
			<NumberInput id="fev1" label="FEV1" min={0} max={10} step={0.01} bind:value={s.fev1} />
		</Field>
		<Field label="FVC (litres)" inputId="fvc">
			<NumberInput id="fvc" label="FVC" min={0} max={10} step={0.01} bind:value={s.fvc} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="FEV1/FVC Ratio" description={ratioDesc}>
			<p class="static-value">{s.fev1FvcRatio ?? '—'}</p>
		</Field>
		<Field label="FEV1 % Predicted" inputId="fev1Pct">
			<NumberInput id="fev1Pct" label="FEV1 percent predicted" min={0} max={150} bind:value={s.fev1PercentPredicted} />
		</Field>
	</div>

	<Field label="Significant bronchodilator response?">
		<RadioGroup label="Bronchodilator response">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bdr" value={opt.value} bind:group={s.bronchodilatorResponse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
	.static-value { margin: 0; font-weight: 500; }
</style>
