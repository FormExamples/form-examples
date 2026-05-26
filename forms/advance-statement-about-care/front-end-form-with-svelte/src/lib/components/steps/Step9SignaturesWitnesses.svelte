<script lang="ts">
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const sw = assessment.data.signaturesWitnesses;
</script>

<Fieldset legend="Signatures & Witnesses">
	<p class="hint">Signing and witnessing your advance statement to confirm its validity</p>
	<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
		<strong>About signing:</strong> Your advance statement is a record of your wishes. While it
		does not need to be witnessed to be valid, having a witness and healthcare professional
		acknowledgement strengthens the document and helps ensure your wishes are respected.
	</div>

	<div class="border-b border-gray-200 pb-4 mb-4">
		<h3 class="mb-3 text-sm font-semibold text-gray-700">Patient Signature</h3>
		<Field label="Your signature (type your full name)" required inputId="patientSignature"><TextInput id="patientSignature" label="Your signature (type your full name)" required placeholder="Type your full name as your signature" bind:value={sw.patientSignature} /></Field>
		<Field label="Date" required inputId="patientSignatureDate"><DateInput id="patientSignatureDate" label="Date" required bind:value={sw.patientSignatureDate} /></Field>
	</div>

	<div class="border-b border-gray-200 pb-4 mb-4">
		<h3 class="mb-3 text-sm font-semibold text-gray-700">Witness Details</h3>
		<Field label="Witness name" inputId="witnessName"><TextInput id="witnessName" label="Witness name" bind:value={sw.witnessName} /></Field>
		<Field label="Witness address" inputId="witnessAddress"><TextInput id="witnessAddress" label="Witness address" bind:value={sw.witnessAddress} /></Field>
		<Field label="Witness signature (type full name)" inputId="witnessSignature"><TextInput id="witnessSignature" label="Witness signature (type full name)" placeholder="Type full name as signature" bind:value={sw.witnessSignature} /></Field>
		<Field label="Witness signature date" inputId="witnessSignatureDate"><DateInput id="witnessSignatureDate" label="Witness signature date" bind:value={sw.witnessSignatureDate} /></Field>
	</div>

	<div class="border-b border-gray-200 pb-4 mb-4">
		<h3 class="mb-3 text-sm font-semibold text-gray-700">Review Date</h3>
		<Field label="When should this statement be reviewed?" inputId="reviewDate"><DateInput id="reviewDate" label="When should this statement be reviewed?" bind:value={sw.reviewDate} /></Field>
		<p class="mt-1 text-xs text-gray-500">
			It is recommended to review your advance statement at least once a year, or when your circumstances change.
		</p>
	</div>

	<div>
		<h3 class="mb-3 text-sm font-semibold text-gray-700">Healthcare Professional Acknowledgement</h3>
		<Field label="Healthcare professional name" inputId="hcpName"><TextInput id="hcpName" label="Healthcare professional name" bind:value={sw.healthcareProfessionalName} /></Field>
		<Field label="Role / position" inputId="hcpRole"><TextInput id="hcpRole" label="Role / position" placeholder="e.g. General Practitioner, Consultant" bind:value={sw.healthcareProfessionalRole} /></Field>
		<Field label="Healthcare professional signature (type full name)" inputId="hcpSignature"><TextInput id="hcpSignature" label="Healthcare professional signature (type full name)" placeholder="Type full name as signature" bind:value={sw.healthcareProfessionalSignature} /></Field>
		<Field label="Date" inputId="hcpDate"><DateInput id="hcpDate" label="Date" bind:value={sw.healthcareProfessionalDate} /></Field>
	</div>
</Fieldset>
