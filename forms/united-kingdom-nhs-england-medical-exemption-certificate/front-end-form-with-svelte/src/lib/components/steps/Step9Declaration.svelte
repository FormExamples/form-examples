<script lang="ts">
	import { application } from '$lib/stores/application.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const dec = application.data.declaration;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Practitioner declaration"
	description="The FP92A must be signed in ink by a practitioner with access to the patient's medical records. NHSBSA Bridge House does not accept scans, photocopies, or printouts."
>
	<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
		NHSBSA only accepts the original paper FP92A posted to Bridge House. This digital
		application is a staging tool to prepare the data before printing.
	</div>

	<RadioGroup
		label="I have access to the patient's medical records"
		name="practitionerHasAccessToMedicalRecords"
		options={yesNoOptions}
		bind:value={dec.practitionerHasAccessToMedicalRecords}
		required
	/>

	<RadioGroup
		label="Signature applied to the printed FP92A?"
		name="practitionerSignaturePresent"
		options={yesNoOptions}
		bind:value={dec.practitionerSignaturePresent}
		required
	/>

	<TextInput
		label="Signature date"
		name="signatureDate"
		type="date"
		bind:value={dec.signatureDate}
		required
	/>

	<TextArea
		label="Practitioner declaration text (optional)"
		name="practitionerDeclarationText"
		bind:value={dec.practitionerDeclarationText}
		placeholder="Free-text declaration captured from the FP92A signature panel."
		rows={3}
	/>
</SectionCard>
