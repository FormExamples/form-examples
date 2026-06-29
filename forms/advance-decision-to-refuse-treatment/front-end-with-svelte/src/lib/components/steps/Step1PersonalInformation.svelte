<script lang="ts">
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import EmailInput from '$lib/components/ui/EmailInput.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const d = assessment.data.personalInformation;
</script>

<Fieldset legend="Personal Information">
	<p class="hint">Your full legal details as they will appear on the ADRT document</p>
	<Field label="Full Legal Name" required inputId="fullLegalName"><TextInput id="fullLegalName" label="Full Legal Name" required bind:value={d.fullLegalName} /></Field>
	<Field label="Date of Birth" required inputId="dob"><DateInput id="dob" label="Date of Birth" required bind:value={d.dateOfBirth} /></Field>
	<Field label="NHS Number" inputId="nhsNumber"><TextInput id="nhsNumber" label="NHS Number" placeholder="e.g. 943 476 5919" bind:value={d.nhsNumber} /></Field>
	<Field label="Address" required inputId="address"><TextInput id="address" label="Address" required bind:value={d.address} /></Field>
	<Field label="Postcode" required inputId="postcode"><TextInput id="postcode" label="Postcode" required bind:value={d.postcode} /></Field>
	<Field label="Telephone" inputId="telephone"><TextInput id="telephone" label="Telephone" bind:value={d.telephone} /></Field>
	<Field label="Email" inputId="email"><EmailInput id="email" label="Email" bind:value={d.email} /></Field>

	<div class="mt-6 border-t border-base-300 pt-4">
		<h3 class="mb-3 text-sm font-semibold text-base-content/80">GP Details</h3>
		<Field label="GP Name" inputId="gpName"><TextInput id="gpName" label="GP Name" bind:value={d.gpName} /></Field>
		<Field label="GP Practice" inputId="gpPractice"><TextInput id="gpPractice" label="GP Practice" bind:value={d.gpPractice} /></Field>
		<Field label="GP Address" inputId="gpAddress"><TextInput id="gpAddress" label="GP Address" bind:value={d.gpAddress} /></Field>
		<Field label="GP Telephone" inputId="gpTelephone"><TextInput id="gpTelephone" label="GP Telephone" bind:value={d.gpTelephone} /></Field>
	</div>
</Fieldset>
