<script lang="ts">
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import EmailInput from '#lib/components/ui/EmailInput.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const p = $state(assessment.data.personalInformation);
</script>

<Fieldset legend="Personal Information">
	<p class="hint">Your basic details for identification and contact purposes</p>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="First Name" required inputId="firstName"><TextInput id="firstName" label="First Name" required bind:value={p.firstName} /></Field>
		<Field label="Last Name" required inputId="lastName"><TextInput id="lastName" label="Last Name" required bind:value={p.lastName} /></Field>
	</div>

	<Field label="Date of Birth" required inputId="dob"><DateInput id="dob" label="Date of Birth" required bind:value={p.dateOfBirth} /></Field>
	<Field label="NHS Number" inputId="nhsNumber"><TextInput id="nhsNumber" label="NHS Number" placeholder="e.g. 943 476 5919" bind:value={p.nhsNumber} /></Field>
	<Field label="Address" required inputId="address"><TextInput id="address" label="Address" required bind:value={p.address} /></Field>
	<Field label="Postcode" inputId="postcode"><TextInput id="postcode" label="Postcode" bind:value={p.postcode} /></Field>
	<Field label="Telephone" inputId="telephone"><TextInput id="telephone" label="Telephone" bind:value={p.telephone} /></Field>
	<Field label="Email" inputId="email"><EmailInput id="email" label="Email" bind:value={p.email} /></Field>

	<div class="mt-4 border-t border-base-300 pt-4">
		<h3 class="mb-3 text-sm font-semibold text-base-content/70">GP Details</h3>
		<Field label="GP Name" inputId="gpName"><TextInput id="gpName" label="GP Name" bind:value={p.gpName} /></Field>
		<Field label="GP Practice" inputId="gpPractice"><TextInput id="gpPractice" label="GP Practice" bind:value={p.gpPractice} /></Field>
		<Field label="GP Telephone" inputId="gpTelephone"><TextInput id="gpTelephone" label="GP Telephone" bind:value={p.gpTelephone} /></Field>
	</div>
</Fieldset>
