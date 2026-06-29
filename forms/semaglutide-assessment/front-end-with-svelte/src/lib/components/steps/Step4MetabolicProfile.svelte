<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const mp = assessment.data.metabolicProfile;
</script>

<Fieldset legend="Metabolic Profile">
	<p class="hint">Key metabolic markers relevant to semaglutide prescribing.</p>

	<h3 class="section-h">Glycaemic Control</h3>
	<div class="field-grid">
		<Field label="HbA1c (%)" inputId="hba1c">
			<NumberInput id="hba1c" label="HbA1c" min={3} max={20} step={0.1} bind:value={mp.hba1c} />
		</Field>
		<Field label="Fasting Glucose (mmol/L)" inputId="fastingGlucose">
			<NumberInput id="fastingGlucose" label="Fasting glucose" min={1} max={30} step={0.1} bind:value={mp.fastingGlucose} />
		</Field>
	</div>
	<Field label="Fasting Insulin Level (mIU/L)" inputId="insulinLevel">
		<NumberInput id="insulinLevel" label="Insulin level" min={0} max={200} step={0.1} bind:value={mp.insulinLevel} />
	</Field>

	<h3 class="section-h">Lipid Profile</h3>
	<div class="field-grid">
		<Field label="Total Cholesterol (mmol/L)" inputId="totalCholesterol">
			<NumberInput id="totalCholesterol" label="Total cholesterol" min={1} max={15} step={0.1} bind:value={mp.totalCholesterol} />
		</Field>
		<Field label="LDL Cholesterol (mmol/L)" inputId="ldl">
			<NumberInput id="ldl" label="LDL" min={0} max={10} step={0.1} bind:value={mp.ldl} />
		</Field>
		<Field label="HDL Cholesterol (mmol/L)" inputId="hdl">
			<NumberInput id="hdl" label="HDL" min={0} max={5} step={0.1} bind:value={mp.hdl} />
		</Field>
		<Field label="Triglycerides (mmol/L)" inputId="triglycerides">
			<NumberInput id="triglycerides" label="Triglycerides" min={0} max={20} step={0.1} bind:value={mp.triglycerides} />
		</Field>
	</div>

	<h3 class="section-h">Thyroid</h3>
	<Field label="Thyroid Function" inputId="thyroidFunction">
		<TextInput id="thyroidFunction" label="Thyroid function" placeholder="e.g., Normal, Hypothyroid, Hyperthyroid, TSH level..." bind:value={mp.thyroidFunction} />
	</Field>
</Fieldset>

<style>
	.section-h { font-weight: 600; margin: 1rem 0 0.5rem; color: var(--color-text); }
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
