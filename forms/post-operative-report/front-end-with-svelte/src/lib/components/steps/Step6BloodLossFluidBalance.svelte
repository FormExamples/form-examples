<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.bloodLossFluidBalance;
</script>

<Fieldset legend="Estimated Blood Loss & Fluid Balance">
	<p class="hint">Intra-operative blood loss and fluid administration.</p>

	<Field label="Estimated blood loss (mL)" inputId="estimatedBloodLossMl">
		<NumberInput id="estimatedBloodLossMl" label="Estimated blood loss" min={0} max={20000} bind:value={d.estimatedBloodLossMl} />
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Crystalloids (mL)" inputId="crystalloidsMl">
			<NumberInput id="crystalloidsMl" label="Crystalloids" min={0} max={20000} bind:value={d.crystalloidsMl} />
		</Field>
		<Field label="Colloids (mL)" inputId="colloidsMl">
			<NumberInput id="colloidsMl" label="Colloids" min={0} max={20000} bind:value={d.colloidsMl} />
		</Field>
		<Field label="Blood products (mL)" inputId="bloodProductsMl">
			<NumberInput id="bloodProductsMl" label="Blood products" min={0} max={20000} bind:value={d.bloodProductsMl} />
		</Field>
	</div>

	<Field label="Blood product details" inputId="bloodProductDetails">
		<TextAreaInput id="bloodProductDetails" label="Blood product details" rows={2} placeholder="Units of PRBC, FFP, platelets, cryoprecipitate, cell salvage, etc." bind:value={d.bloodProductDetails} />
	</Field>

	<div class="field-grid">
		<Field label="Urine output (mL)" inputId="urineOutputMl">
			<NumberInput id="urineOutputMl" label="Urine output" min={0} max={20000} bind:value={d.urineOutputMl} />
		</Field>
		<Field label="Other drains output (mL)" inputId="otherDrainsMl">
			<NumberInput id="otherDrainsMl" label="Other drains output" min={0} max={20000} bind:value={d.otherDrainsMl} />
		</Field>
	</div>

	<Field label="Fluid balance notes" inputId="fluidNotes">
		<TextAreaInput id="fluidNotes" label="Fluid balance notes" rows={2} placeholder="Net balance, ongoing losses, special considerations." bind:value={d.fluidNotes} />
	</Field>
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
