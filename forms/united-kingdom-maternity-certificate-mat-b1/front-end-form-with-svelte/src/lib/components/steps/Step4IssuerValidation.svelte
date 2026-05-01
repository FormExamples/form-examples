<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const issuer = assessment.data.issuer;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Issuer Validation"
	description="The MAT B1 must be signed by either a registered doctor or a registered midwife. Doctors apply a name-and-address stamp; midwives provide their NMC personal identification number and registration expiry date."
>
	<RadioGroup
		label="Issuer type"
		name="issuerType"
		options={[
			{ value: 'doctor', label: 'Doctor' },
			{ value: 'midwife', label: 'Registered midwife' }
		]}
		bind:value={issuer.issuerType}
		required
	/>

	{#if issuer.issuerType === 'doctor'}
		<div class="mt-2 mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
			DWP guidance: doctors must apply their official name-and-address stamp to
			every MAT B1 they issue.
		</div>

		<TextInput
			label="Doctor's name"
			name="doctorName"
			bind:value={issuer.doctor.doctorName}
			required
		/>

		<TextInput
			label="Practice name"
			name="practiceName"
			bind:value={issuer.doctor.practiceName}
			required
		/>

		<TextArea
			label="Practice address"
			name="practiceAddress"
			bind:value={issuer.doctor.practiceAddress}
			rows={2}
		/>

		<RadioGroup
			label="Has the official name-and-address stamp been applied?"
			name="stampApplied"
			options={yesNoOptions}
			bind:value={issuer.doctor.stampApplied}
			required
		/>
	{:else if issuer.issuerType === 'midwife'}
		<div class="mt-2 mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
			DWP guidance: registered midwives must record their NMC personal
			identification number (PIN) and the expiry date of their NMC registration
			on every MAT B1 they sign.
		</div>

		<TextInput
			label="Midwife's full name"
			name="midwifeName"
			bind:value={issuer.midwife.midwifeName}
			required
		/>

		<TextInput
			label="NMC personal identification number (PIN)"
			name="nmcPin"
			bind:value={issuer.midwife.nmcPin}
			placeholder="e.g. 12A3456E"
			required
		/>

		<TextInput
			label="NMC registration expiry date"
			name="nmcExpiryDate"
			type="date"
			bind:value={issuer.midwife.nmcExpiryDate}
			required
		/>
	{:else}
		<p class="mb-4 text-sm text-gray-500">
			Select an issuer type above to continue.
		</p>
	{/if}

	<hr class="my-6 border-gray-200" />

	<TextInput
		label="Pre-printed unique certificate number"
		name="certificateNumber"
		bind:value={issuer.certificateNumber}
		placeholder="From the official MAT B1 form"
		required
	/>

	<TextInput
		label="Issue date (date the certificate is signed)"
		name="issueDate"
		type="date"
		bind:value={issuer.issueDate}
		required
	/>

	<RadioGroup
		label="Is this certificate a duplicate replacement?"
		name="isDuplicate"
		options={yesNoOptions}
		bind:value={issuer.isDuplicate}
	/>

	{#if issuer.isDuplicate === 'yes'}
		<RadioGroup
			label='Has the form been marked "DUPLICATE"?'
			name="duplicateMarkerApplied"
			options={yesNoOptions}
			bind:value={issuer.duplicateMarkerApplied}
			required
		/>
	{/if}

	<RadioGroup
		label="Has the certificate been completed in ink (not pencil)?"
		name="completedInInk"
		options={yesNoOptions}
		bind:value={issuer.completedInInk}
		required
	/>
</SectionCard>
