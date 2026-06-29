<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const c = request.data.clinician;
</script>

<Fieldset legend="1. Requesting Clinician">
	<p class="hint">Who is requesting the monitoring, their registration, and contact details.</p>

	<Field label="Requesting clinician" inputId="clinicianName" required>
		<TextInput
			id="clinicianName"
			label="Requesting clinician"
			placeholder="e.g. Dr Sarah Owen"
			bind:value={c.clinicianName}
			required
		/>
	</Field>

	<Field label="Role" inputId="clinicianRole">
		<TextInput
			id="clinicianRole"
			label="Role"
			placeholder="e.g. GP, cardiologist, cardiac physiologist, nurse"
			bind:value={c.clinicianRole}
		/>
	</Field>

	<Field label="Registration body" inputId="registrationBody">
		<TextInput
			id="registrationBody"
			label="Registration body"
			placeholder="e.g. GMC, NMC, HCPC"
			bind:value={c.registrationBody}
		/>
	</Field>

	<Field label="Registration number" inputId="registrationNumber">
		<TextInput
			id="registrationNumber"
			label="Registration number"
			placeholder="e.g. 7012345"
			bind:value={c.registrationNumber}
		/>
	</Field>

	<Field label="Supervising consultant" inputId="supervisingConsultant" description="If the requester is in training.">
		<TextInput
			id="supervisingConsultant"
			label="Supervising consultant"
			bind:value={c.supervisingConsultant}
		/>
	</Field>

	<Field label="Requester contact" inputId="requesterContact" description="For any vetting queries.">
		<TextInput
			id="requesterContact"
			label="Requester contact"
			placeholder="e.g. email or bleep"
			bind:value={c.requesterContact}
		/>
	</Field>

	<Field label="Requesting site" inputId="siteName">
		<TextInput
			id="siteName"
			label="Requesting site"
			placeholder="e.g. practice or hospital"
			bind:value={c.siteName}
		/>
	</Field>

	<Field label="Referral date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral date" bind:value={c.referralDate} />
	</Field>
</Fieldset>
