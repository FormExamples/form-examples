<script lang="ts">
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const d = assessment.data.patientInformation;
</script>

<Fieldset legend="Patient Information">
	<p class="hint">Patient demographic and specimen details</p>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="Patient Name" required inputId="patientName"><TextInput id="patientName" label="Patient Name" required placeholder="e.g. Jane Smith" bind:value={d.patientName} /></Field>
		<Field label="Date of Birth" required inputId="dateOfBirth"><DateInput id="dateOfBirth" label="Date of Birth" required bind:value={d.dateOfBirth} /></Field>
	</div>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="Medical Record Number" inputId="medicalRecordNumber"><TextInput id="medicalRecordNumber" label="Medical Record Number" placeholder="e.g. MRN-123456" bind:value={d.medicalRecordNumber} /></Field>
		<Field label="Referring Physician" inputId="referringPhysician"><TextInput id="referringPhysician" label="Referring Physician" placeholder="e.g. Dr Johnson" bind:value={d.referringPhysician} /></Field>
	</div>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="Clinical Indication" inputId="clinicalIndication"><TextInput id="clinicalIndication" label="Clinical Indication" placeholder="e.g. Suspected anemia, fatigue" bind:value={d.clinicalIndication} /></Field>
		<Field label="Specimen Date" inputId="specimenDate"><DateInput id="specimenDate" label="Specimen Date" bind:value={d.specimenDate} /></Field>
	</div>

	<Field label="Specimen Type" inputId="specimenType"><Select id="specimenType" label="Specimen Type" bind:value={d.specimenType}><option value="">-- Select --</option>{#each [
			{ value: 'edtaBlood', label: 'EDTA Blood' },
			{ value: 'citratedBlood', label: 'Citrated Blood' },
			{ value: 'serumSample', label: 'Serum Sample' },
			{ value: 'boneMarrow', label: 'Bone Marrow' },
			{ value: 'other', label: 'Other' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
</Fieldset>
