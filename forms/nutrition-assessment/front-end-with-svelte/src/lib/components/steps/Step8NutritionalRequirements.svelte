<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const r = assessment.data.nutritionalRequirements;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Nutritional Requirements">
	<p class="hint">Estimated daily energy, protein, and fluid requirements.</p>

	<div class="field-grid field-grid-3">
		<Field label="Estimated energy (kcal/day)" inputId="estimatedEnergyKcal">
			<NumberInput id="estimatedEnergyKcal" label="Estimated energy" min={0} max={6000} bind:value={r.estimatedEnergyKcal} />
		</Field>
		<Field label="Estimated protein (g/day)" inputId="estimatedProteinG">
			<NumberInput id="estimatedProteinG" label="Estimated protein" min={0} max={500} step={0.1} bind:value={r.estimatedProteinG} />
		</Field>
		<Field label="Estimated fluid (ml/day)" inputId="estimatedFluidMl">
			<NumberInput id="estimatedFluidMl" label="Estimated fluid" min={0} max={10000} bind:value={r.estimatedFluidMl} />
		</Field>
	</div>

	<Field label="How were these requirements estimated?" inputId="requirementsBasis">
		<TextAreaInput id="requirementsBasis" label="Requirements basis" rows={2} placeholder="e.g. Schofield equation, Henry equation, body-weight rule…" bind:value={r.requirementsBasis} />
	</Field>

	<Field label="Are requirements increased above baseline?">
		<RadioGroup label="Increased requirements">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="increasedRequirements" value={opt.value} bind:group={r.increasedRequirements} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.increasedRequirements === 'yes'}
		<Field label="Reason for increased requirements" inputId="increasedRequirementsReason">
			<TextAreaInput id="increasedRequirementsReason" label="Increased requirements reason" rows={2} placeholder="e.g. wound healing, sepsis, burns, pregnancy…" bind:value={r.increasedRequirementsReason} />
		</Field>
	{/if}
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
</style>
