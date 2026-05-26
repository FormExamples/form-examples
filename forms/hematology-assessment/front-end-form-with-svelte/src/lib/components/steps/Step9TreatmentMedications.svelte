<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const d = assessment.data.treatmentMedications;
</script>

<Fieldset legend="Treatment & Medications">
	<p class="hint">Document current treatments, medications, and response to therapy</p>
	<Field label="Current Medications" inputId="currentMedications"><TextAreaInput id="currentMedications" label="Current Medications" placeholder="List all current medications and dosages" bind:value={d.currentMedications} /></Field>
	<Field label="Chemotherapy Regimen (if applicable)" inputId="chemotherapyRegimen"><TextAreaInput id="chemotherapyRegimen" label="Chemotherapy Regimen (if applicable)" rows={2} placeholder="e.g. R-CHOP cycle 3 of 6, ABVD" bind:value={d.chemotherapyRegimen} /></Field>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="Anticoagulant Therapy" inputId="anticoagulantTherapy"><Select id="anticoagulantTherapy" label="Anticoagulant Therapy" bind:value={d.anticoagulantTherapy}><option value="">-- Select --</option>{#each [
				{ value: 'none', label: 'None' },
				{ value: 'warfarin', label: 'Warfarin' },
				{ value: 'heparin', label: 'Heparin' },
				{ value: 'lmwh', label: 'LMWH (Enoxaparin)' },
				{ value: 'doac', label: 'DOAC (Rivaroxaban/Apixaban)' },
				{ value: 'other', label: 'Other' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
		<Field label="Iron Therapy" inputId="ironTherapy"><Select id="ironTherapy" label="Iron Therapy" bind:value={d.ironTherapy}><option value="">-- Select --</option>{#each [
				{ value: 'none', label: 'None' },
				{ value: 'oralIron', label: 'Oral Iron' },
				{ value: 'ivIron', label: 'IV Iron' },
				{ value: 'both', label: 'Both Oral and IV' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	</div>

	<Field label="Treatment Response" inputId="treatmentResponse"><TextAreaInput id="treatmentResponse" label="Treatment Response" rows={2} placeholder="e.g. Partial response, stable disease, complete remission" bind:value={d.treatmentResponse} /></Field>
	<Field label="Adverse Effects" inputId="adverseEffects"><TextAreaInput id="adverseEffects" label="Adverse Effects" rows={2} placeholder="Document any treatment-related adverse effects" bind:value={d.adverseEffects} /></Field>
</Fieldset>
