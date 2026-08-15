<script lang="ts">
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import EmailInput from '#lib/components/ui/EmailInput.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const p = assessment.data.personalInformation;
</script>

<Fieldset legend="Personal Information">
	<p class="hint">Please provide your basic personal details</p>
	<Field label="Full Name" required inputId="fullName"><TextInput id="fullName" label="Full Name" required bind:value={p.fullName} /></Field>

	<Field label="Date of Birth" required inputId="dob"><DateInput id="dob" label="Date of Birth" required bind:value={p.dateOfBirth} /></Field>

	<Field label="Sex" required><RadioGroup label="Sex">{#each [
			{ value: 'male', label: 'Male' },
			{ value: 'female', label: 'Female' },
			{ value: 'other', label: 'Other' }
		] as opt (opt.value)}<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={p.sex} required/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Address Line 1" required inputId="addr1"><TextInput id="addr1" label="Address Line 1" required bind:value={p.addressLine1} /></Field>
	<Field label="Address Line 2" inputId="addr2"><TextInput id="addr2" label="Address Line 2" bind:value={p.addressLine2} /></Field>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="City" required inputId="city"><TextInput id="city" label="City" required bind:value={p.city} /></Field>
		<Field label="Postcode" required inputId="postcode"><TextInput id="postcode" label="Postcode" required bind:value={p.postcode} /></Field>
	</div>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="Phone Number" required inputId="phone"><TextInput id="phone" label="Phone Number" required bind:value={p.phone} /></Field>
		<Field label="Email" inputId="email"><EmailInput id="email" label="Email" bind:value={p.email} /></Field>
	</div>

	<div class="mt-4 border-t border-base-300 pt-4">
		<h3 class="mb-3 text-sm font-semibold text-base-content/70">Emergency Contact</h3>
		<Field label="Contact Name" required inputId="emergName"><TextInput id="emergName" label="Contact Name" required bind:value={p.emergencyContactName} /></Field>
		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<Field label="Contact Phone" required inputId="emergPhone"><TextInput id="emergPhone" label="Contact Phone" required bind:value={p.emergencyContactPhone} /></Field>
			<Field label="Relationship" inputId="emergRelation"><TextInput id="emergRelation" label="Relationship" bind:value={p.emergencyContactRelationship} /></Field>
		</div>
	</div>
</Fieldset>
