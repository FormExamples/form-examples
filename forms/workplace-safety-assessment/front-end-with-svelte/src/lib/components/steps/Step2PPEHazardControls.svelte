<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoNA from '#lib/components/ui/YesNoNA.svelte';

	const d = assessment.data.ppeHazardControls;
</script>

<Fieldset legend="PPE & Hazard Controls">
	<p class="hint">Personal protective equipment, signage, and general housekeeping.</p>

	<YesNoNA id="ppeAvailable" label="Appropriate PPE is available for the task." bind:value={d.ppeAvailable} />
	<YesNoNA id="ppeCorrectlyUsed" label="PPE is being correctly used by staff." bind:value={d.ppeCorrectlyUsed} />
	<YesNoNA id="ppeStockMaintained" label="PPE stock is maintained at adequate levels." bind:value={d.ppeStockMaintained} />
	<YesNoNA id="hazardSignageVisible" label="Hazard signage is visible where required." bind:value={d.hazardSignageVisible} />
	<YesNoNA id="signageLegible" label="Signage is legible and not faded." bind:value={d.signageLegible} />
	<YesNoNA id="housekeepingSatisfactory" label="General housekeeping is satisfactory." bind:value={d.housekeepingSatisfactory} />
	<YesNoNA id="slipTripHazardsControlled" label="Slip, trip and fall hazards are controlled." bind:value={d.slipTripHazardsControlled} />

	<Field label="Observations" inputId="ppeObservations">
		<TextAreaInput id="ppeObservations" label="Observations" rows={3} placeholder="Evidence, photographs filed, narrative detail…" bind:value={d.observations} />
	</Field>
</Fieldset>
