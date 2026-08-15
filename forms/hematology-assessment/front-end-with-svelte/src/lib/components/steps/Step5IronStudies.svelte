<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const d = assessment.data.ironStudies;
</script>

<Fieldset legend="Iron Studies">
	<p class="hint">Enter iron panel and reticulocyte results</p>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Serum Iron" name="serumIron" unit="mcg/dL" step={1} bind:value={d.serumIron} placeholder="Normal: 60-170" />
		<NumberInput label="Total Iron Binding Capacity" name="totalIronBindingCapacity" unit="mcg/dL" step={1} bind:value={d.totalIronBindingCapacity} placeholder="Normal: 250-370" />
	</div>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Transferrin Saturation" name="transferrinSaturation" unit="%" step={1} bind:value={d.transferrinSaturation} placeholder="Normal: 20-50" />
		<NumberInput label="Serum Ferritin" name="serumFerritin" unit="ng/mL" step={1} bind:value={d.serumFerritin} placeholder="Normal: 20-250" />
	</div>

	<NumberInput label="Reticulocyte Count" name="reticulocyteCount" unit="%" step={0.1} bind:value={d.reticulocyteCount} placeholder="Normal: 0.5-2.5" />
</Fieldset>
