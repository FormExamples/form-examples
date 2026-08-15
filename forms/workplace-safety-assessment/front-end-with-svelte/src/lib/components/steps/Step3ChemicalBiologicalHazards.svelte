<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoNA from '#lib/components/ui/YesNoNA.svelte';

	const d = assessment.data.chemicalBiologicalHazards;
</script>

<Fieldset legend="Chemical & Biological Hazards">
	<p class="hint">COSHH register, SDS, labelling, storage, spill response, sharps and clinical waste.</p>

	<YesNoNA id="coshhRegisterPresent" label="COSHH register is present and up to date." bind:value={d.coshhRegisterPresent} />
	<YesNoNA id="sdsAvailable" label="Safety Data Sheets (SDS) are available for hazardous substances." bind:value={d.sdsAvailable} />
	<YesNoNA id="chemicalsLabelledCorrectly" label="Chemicals are labelled correctly per CLP." bind:value={d.chemicalsLabelledCorrectly} />
	<YesNoNA id="chemicalsStoredSecurely" label="Chemicals are stored securely (locked, segregated, ventilated)." bind:value={d.chemicalsStoredSecurely} />
	<YesNoNA id="spillKitsAvailable" label="Spill kits are available, accessible and stocked." bind:value={d.spillKitsAvailable} />
	<YesNoNA id="untreatedSpillsObserved" label="No untreated chemical or biological spills observed." bind:value={d.untreatedSpillsObserved} />
	<YesNoNA id="sharpsContainersInDate" label="Sharps containers are in date and not over-filled." bind:value={d.sharpsContainersInDate} />
	<YesNoNA id="clinicalWasteSegregated" label="Clinical waste is correctly segregated." bind:value={d.clinicalWasteSegregated} />
	<YesNoNA id="biologicalRiskAssessmentCurrent" label="Biological agent risk assessment is current." bind:value={d.biologicalRiskAssessmentCurrent} />

	<Field label="Observations" inputId="chemObservations">
		<TextAreaInput id="chemObservations" label="Observations" rows={3} placeholder="Spill kit location, COSHH register format, etc.…" bind:value={d.observations} />
	</Field>
</Fieldset>
