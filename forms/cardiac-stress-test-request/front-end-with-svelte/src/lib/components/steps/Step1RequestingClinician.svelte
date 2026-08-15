<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="1. Requesting Clinician">
	<p class="hint">Who is requesting the stress test, their registration, and contact details.</p>

	<Field label="Clinician name" inputId="clinicianName" required>
		<TextInput
			id="clinicianName"
			label="Clinician name"
			placeholder="e.g. Dr Sarah Owen"
			bind:value={d.clinician.clinicianName}
			required
		/>
	</Field>

	<Field label="Clinician role" inputId="clinicianRole">
		<Select id="clinicianRole" label="Clinician role" bind:value={d.clinician.clinicianRole}>
			<option value="">Select…</option>
			<option value="cardiologist">Cardiologist</option>
			<option value="gp">GP</option>
			<option value="hospital-doctor">Hospital doctor</option>
			<option value="cardiac-physiologist">Cardiac physiologist</option>
			<option value="nurse">Nurse</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Registration body" inputId="registrationBody">
		<Select id="registrationBody" label="Registration body" bind:value={d.clinician.registrationBody}>
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
			bind:value={d.clinician.registrationNumber}
		/>
	</Field>

	<Field label="Requester contact" inputId="requesterContact" description="Bleep / phone for any vetting queries.">
		<TextInput
			id="requesterContact"
			label="Requester contact"
			placeholder="e.g. bleep 1234 or email"
			bind:value={d.clinician.requesterContact}
		/>
	</Field>

	<Field label="Supervising consultant" inputId="supervisingConsultant" description="If the requester is in training.">
		<TextInput
			id="supervisingConsultant"
			label="Supervising consultant"
			bind:value={d.clinician.supervisingConsultant}
		/>
	</Field>

	<Field label="Site / clinic name" inputId="siteName">
		<TextInput id="siteName" label="Site / clinic name" bind:value={d.clinician.siteName} />
	</Field>

	<Field label="Referral date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral date" bind:value={d.clinician.referralDate} />
	</Field>
</Fieldset>
