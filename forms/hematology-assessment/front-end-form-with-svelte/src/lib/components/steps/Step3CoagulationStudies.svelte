<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const d = assessment.data.coagulationStudies;
</script>

<Fieldset legend="Coagulation Studies">
	<p class="hint">Enter coagulation panel results</p>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Prothrombin Time" name="prothrombinTime" unit="seconds" step={0.1} bind:value={d.prothrombinTime} placeholder="Normal: 11.0-13.5" />
		<NumberInput label="INR" name="inr" step={0.1} bind:value={d.inr} placeholder="Normal: 0.8-1.2" />
	</div>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="aPTT" name="activatedPartialThromboplastinTime" unit="seconds" step={0.1} bind:value={d.activatedPartialThromboplastinTime} placeholder="Normal: 25-35" />
		<NumberInput label="Fibrinogen" name="fibrinogen" unit="mg/dL" step={1} bind:value={d.fibrinogen} placeholder="Normal: 200-400" />
	</div>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="D-dimer" name="dDimer" unit="mg/L" step={0.01} bind:value={d.dDimer} placeholder="Normal: <0.5" />
		<NumberInput label="Bleeding Time" name="bleedingTime" unit="minutes" step={0.1} bind:value={d.bleedingTime} placeholder="Normal: 2-7" />
	</div>
</Fieldset>
