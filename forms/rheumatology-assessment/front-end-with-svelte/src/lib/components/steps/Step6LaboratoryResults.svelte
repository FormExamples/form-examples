<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.laboratoryResults;

	const posNegOptions = [
		{ value: 'yes', label: 'Positive' },
		{ value: 'no', label: 'Negative' }
	];
</script>

<Fieldset legend="Laboratory Results">
	<p class="hint">Recent blood test results and serological markers.</p>

	<h3 class="section-h">Inflammatory Markers</h3>
	<div class="field-grid">
		<Field label="ESR (mm/hr)" required inputId="esr">
			<NumberInput id="esr" label="ESR" min={0} max={200} required bind:value={d.esr} />
		</Field>
		<Field label="CRP (mg/L)" inputId="crp">
			<NumberInput id="crp" label="CRP" min={0} max={500} step={0.1} bind:value={d.crp} />
		</Field>
	</div>

	<h3 class="section-h">Serological Markers</h3>
	<Field label="Rheumatoid Factor (RF)">
		<RadioGroup label="Rheumatoid factor">
			{#each posNegOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="rheumatoidFactor" value={opt.value} bind:group={d.rheumatoidFactor} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Anti-CCP Antibodies">
		<RadioGroup label="Anti-CCP">
			{#each posNegOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="antiCCP" value={opt.value} bind:group={d.antiCCP} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="ANA">
		<RadioGroup label="ANA">
			{#each posNegOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ana" value={opt.value} bind:group={d.ana} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="HLA-B27">
		<RadioGroup label="HLA-B27">
			{#each posNegOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hlaB27" value={opt.value} bind:group={d.hlaB27} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<h3 class="section-h">Complete Blood Count</h3>
	<div class="field-grid field-grid-3">
		<Field label="Haemoglobin (g/L)" inputId="haemoglobin">
			<NumberInput id="haemoglobin" label="Haemoglobin" min={0} max={250} bind:value={d.haemoglobin} />
		</Field>
		<Field label="WBC (x10^9/L)" inputId="wbc">
			<NumberInput id="wbc" label="WBC" min={0} max={100} step={0.1} bind:value={d.whiteBloodCellCount} />
		</Field>
		<Field label="Platelets (x10^9/L)" inputId="platelets">
			<NumberInput id="platelets" label="Platelets" min={0} max={1000} bind:value={d.plateletCount} />
		</Field>
	</div>

	<h3 class="section-h">Renal &amp; Liver Function</h3>
	<div class="field-grid">
		<Field label="Creatinine (umol/L)" inputId="creatinine">
			<NumberInput id="creatinine" label="Creatinine" min={0} max={2000} bind:value={d.creatinine} />
		</Field>
		<Field label="eGFR (mL/min)" inputId="egfr">
			<NumberInput id="egfr" label="eGFR" min={0} max={150} bind:value={d.egfr} />
		</Field>
	</div>
	<div class="field-grid">
		<Field label="ALT (U/L)" inputId="alt">
			<NumberInput id="alt" label="ALT" min={0} max={2000} bind:value={d.alt} />
		</Field>
		<Field label="AST (U/L)" inputId="ast">
			<NumberInput id="ast" label="AST" min={0} max={2000} bind:value={d.ast} />
		</Field>
	</div>
</Fieldset>

<style>
	.section-h { font-weight: 600; margin: 1rem 0 0.5rem; color: var(--color-text); }
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	.field-grid.field-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	@media (max-width: 640px) { .field-grid, .field-grid.field-grid-3 { grid-template-columns: 1fr; } }
</style>
