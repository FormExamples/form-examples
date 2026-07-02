<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const f = assessment.data.fluids;
</script>

<Fieldset legend="Step 8 of 12 — Fluids & blood loss">
	<p class="hint">
		Fluid volumes, estimated blood loss, urine output, and cell salvage. Any one value counts as a
		fluids summary for a complete record.
	</p>

	<Field label="Crystalloid (mL)" inputId="fluids-crystalloidMl">
		<NumberInput id="fluids-crystalloidMl" label="Crystalloid (mL)" min={0} step="any" bind:value={f.crystalloidMl} />
	</Field>

	<Field label="Colloid (mL)" inputId="fluids-colloidMl">
		<NumberInput id="fluids-colloidMl" label="Colloid (mL)" min={0} step="any" bind:value={f.colloidMl} />
	</Field>

	<Field label="Blood products (mL)" inputId="fluids-bloodProductsMl">
		<NumberInput id="fluids-bloodProductsMl" label="Blood products (mL)" min={0} step="any" bind:value={f.bloodProductsMl} />
	</Field>

	<Field
		label="Estimated blood loss (mL)"
		description="Recorded for a complete record."
		inputId="fluids-estimatedBloodLossMl"
	>
		<NumberInput id="fluids-estimatedBloodLossMl" label="Estimated blood loss (mL)" min={0} step="any" bind:value={f.estimatedBloodLossMl} />
	</Field>

	<Field label="Urine output (mL)" inputId="fluids-urineOutputMl">
		<NumberInput id="fluids-urineOutputMl" label="Urine output (mL)" min={0} step="any" bind:value={f.urineOutputMl} />
	</Field>

	<Field label="Cell salvage returned (mL)" inputId="fluids-cellSalvageMl">
		<NumberInput id="fluids-cellSalvageMl" label="Cell salvage returned (mL)" min={0} step="any" bind:value={f.cellSalvageMl} />
	</Field>
</Fieldset>
