<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.clinician;
</script>

<Fieldset legend="1. Requesting Clinician">
	<p class="hint">Who is making the EEG request, their registration, and contact details.</p>

	<Field label="Requesting clinician" inputId="clinicianName" required>
		<TextInput
			id="clinicianName"
			label="Requesting clinician"
			placeholder="e.g. Dr Sarah Owen"
			bind:value={d.clinicianName}
			required
		/>
	</Field>

	<Field label="Role" inputId="clinicianRole">
		<TextInput
			id="clinicianRole"
			label="Role"
			placeholder="e.g. GP, neurologist, specialist nurse"
			bind:value={d.clinicianRole}
		/>
	</Field>

	<Field label="Registration body" inputId="registrationBody">
		<TextInput
			id="registrationBody"
			label="Registration body"
			placeholder="e.g. GMC, NMC"
			bind:value={d.registrationBody}
		/>
	</Field>

	<Field label="Registration number" inputId="registrationNumber">
		<TextInput
			id="registrationNumber"
			label="Registration number"
			placeholder="e.g. 7012345"
			bind:value={d.registrationNumber}
		/>
	</Field>

	<Field
		label="Supervising consultant"
		inputId="supervisingConsultant"
		description="If the requester is in training."
	>
		<TextInput
			id="supervisingConsultant"
			label="Supervising consultant"
			bind:value={d.supervisingConsultant}
		/>
	</Field>

	<Field label="Requester contact" inputId="requesterContact" description="For any vetting queries.">
		<TextInput
			id="requesterContact"
			label="Requester contact"
			placeholder="e.g. email or bleep"
			bind:value={d.requesterContact}
		/>
	</Field>

	<Field label="Requesting site / practice / ward" inputId="siteName">
		<TextInput
			id="siteName"
			label="Requesting site / practice / ward"
			placeholder="e.g. Headington Medical Practice"
			bind:value={d.siteName}
		/>
	</Field>

	<Field label="Referral date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral date" bind:value={d.referralDate} />
	</Field>
</Fieldset>
