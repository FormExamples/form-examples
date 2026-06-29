<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const c = request.data.clinician;
</script>

<Fieldset legend="1. Requesting Clinician">
	<p class="hint">Identify the clinician making this referral, their registration, and contact details.</p>

	<Field label="Clinician name" inputId="clinicianName" required>
		<TextInput
			id="clinicianName"
			label="Clinician name"
			placeholder="e.g. Dr H Iqbal"
			bind:value={c.clinicianName}
			required
		/>
	</Field>

	<Field label="Clinician role" inputId="clinicianRole">
		<Select id="clinicianRole" label="Clinician role" bind:value={c.clinicianRole}>
			<option value="">Select…</option>
			<option value="neurologist">Neurologist</option>
			<option value="neurophysiologist">Neurophysiologist</option>
			<option value="gp">GP</option>
			<option value="hospital-doctor">Hospital doctor</option>
			<option value="rheumatologist">Rheumatologist</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Registration body" inputId="registrationBody">
		<Select id="registrationBody" label="Registration body" bind:value={c.registrationBody}>
			<option value="">Select…</option>
			<option value="GMC">GMC</option>
			<option value="NMC">NMC</option>
			<option value="HCPC">HCPC</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Registration number" inputId="registrationNumber">
		<TextInput
			id="registrationNumber"
			label="Registration number"
			placeholder="e.g. 7012345"
			bind:value={c.registrationNumber}
		/>
	</Field>

	<Field label="Requester contact" inputId="requesterContact" description="Bleep / phone for any vetting queries.">
		<TextInput
			id="requesterContact"
			label="Requester contact"
			placeholder="e.g. email or bleep"
			bind:value={c.requesterContact}
		/>
	</Field>

	<Field label="Supervising consultant" inputId="supervisingConsultant" description="If the referrer is in training.">
		<TextInput
			id="supervisingConsultant"
			label="Supervising consultant"
			bind:value={c.supervisingConsultant}
		/>
	</Field>

	<Field label="Site / clinic name" inputId="siteName">
		<TextInput id="siteName" label="Site / clinic name" bind:value={c.siteName} />
	</Field>

	<Field label="Referral date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral date" bind:value={c.referralDate} />
	</Field>
</Fieldset>
