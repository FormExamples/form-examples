<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const d = request.data.contrast;

	const contrastOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'iv-gadolinium', label: 'IV gadolinium' },
		{ value: 'unknown', label: 'Unknown' }
	];

	const reactionOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' },
		{ value: 'unknown', label: 'Unknown' }
	];

	const pregnancyOptions = [
		{ value: 'not-pregnant', label: 'Not pregnant' },
		{ value: 'pregnant', label: 'Pregnant' },
		{ value: 'possible', label: 'Possible' },
		{ value: 'unknown', label: 'Unknown' },
		{ value: 'not-applicable', label: 'Not applicable' }
	];
</script>

<Fieldset legend="Contrast and renal">
	<p class="hint">Gadolinium contrast and renal / NSF risk; gadolinium with eGFR &lt; 30 is contraindicated.</p>

	<div class="field-grid">
		<Field label="Contrast required" inputId="contrastRequired">
			<Select id="contrastRequired" label="Contrast required" bind:value={d.contrastRequired}>
				<option value="">— Select —</option>
				{#each contrastOptions as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="eGFR (mL/min/1.73m²)" inputId="egfr">
			<NumberInput id="egfr" label="eGFR" min={0} max={200} step={0.1} bind:value={d.egfr} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Previous gadolinium reaction" inputId="previousGadoliniumReaction">
			<Select id="previousGadoliniumReaction" label="Previous gadolinium reaction" bind:value={d.previousGadoliniumReaction}>
				<option value="">— Select —</option>
				{#each reactionOptions as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Pregnancy status" inputId="pregnancyStatus">
			<Select id="pregnancyStatus" label="Pregnancy status" bind:value={d.pregnancyStatus}>
				<option value="">— Select —</option>
				{#each pregnancyOptions as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</Select>
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
