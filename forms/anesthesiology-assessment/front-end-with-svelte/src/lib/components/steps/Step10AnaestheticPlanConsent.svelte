<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.investigationsAndPlan;
</script>

<Fieldset legend="Anaesthetic Plan & Consent">
	<p class="hint">The proposed anaesthetic technique, airway plan, post-operative destination, and any special requirements.</p>

	<div class="field-grid field-grid-3">
		<Field label="Proposed technique" inputId="proposedTechnique">
			<Select id="proposedTechnique" label="Proposed technique" bind:value={d.proposedTechnique}>
				<option value="">Select…</option>
				<option value="general">General</option>
				<option value="regional">Regional</option>
				<option value="sedation">Sedation</option>
				<option value="local">Local</option>
				<option value="combined">Combined</option>
			</Select>
		</Field>
		<Field label="Airway plan" inputId="airwayPlan">
			<Select id="airwayPlan" label="Airway plan" bind:value={d.airwayPlan}>
				<option value="">Select…</option>
				<option value="facemask">Facemask</option>
				<option value="lma">LMA</option>
				<option value="ett">Endotracheal tube</option>
				<option value="awake-fibreoptic">Awake fibreoptic</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Post-op destination" inputId="postOpDestination">
			<Select id="postOpDestination" label="Post-op destination" bind:value={d.postOpDestination}>
				<option value="">Select…</option>
				<option value="ward">Ward</option>
				<option value="hdu">HDU</option>
				<option value="icu">ICU</option>
			</Select>
		</Field>
	</div>

	<Field label="Special requirements & consent notes" inputId="specialRequirements">
		<TextAreaInput id="specialRequirements" label="Special requirements & consent notes" rows={4} bind:value={d.specialRequirements} />
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
