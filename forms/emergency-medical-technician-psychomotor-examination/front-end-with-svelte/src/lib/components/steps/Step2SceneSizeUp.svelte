<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.sceneSizeUp;
</script>

<Fieldset legend="Scene Size-Up">
	<p class="hint">Initial assessment of the scene before approaching the patient.</p>

	<TriStateField
		label="Takes or verbalizes appropriate body-substance / PPE precautions."
		name="ppePrecautions"
		critical
		bind:value={d.ppePrecautions}
	/>
	<TriStateField
		label="Determines the scene / situation is safe before approaching the patient."
		name="sceneSafe"
		critical
		bind:value={d.sceneSafe}
	/>
	<TriStateField
		label="Determines the mechanism of injury / nature of illness (MOI/NOI)."
		name="mechanismOrNature"
		bind:value={d.mechanismOrNature}
	/>
	<TriStateField
		label="Determines the number of patients on scene."
		name="numberOfPatients"
		bind:value={d.numberOfPatients}
	/>
	<TriStateField
		label="Requests additional EMS / ALS / fire / law-enforcement resources as needed."
		name="additionalResources"
		bind:value={d.additionalResources}
	/>
	<TriStateField
		label="Considers stabilization of the spine when indicated by MOI."
		name="considersCspine"
		bind:value={d.considersCspine}
	/>
</Fieldset>
