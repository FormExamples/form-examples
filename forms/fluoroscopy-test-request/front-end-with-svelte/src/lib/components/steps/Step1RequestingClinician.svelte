<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.clinician;
</script>

<Fieldset legend="1. Requesting Clinician">
	<p class="hint">Who is requesting the study, their registration, and contact details.</p>

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
		<Select id="clinicianRole" label="Role" bind:value={d.clinicianRole}>
			<option value="">Select…</option>
			<option value="radiologist">Radiologist</option>
			<option value="gp">GP</option>
			<option value="hospital-doctor">Hospital doctor</option>
			<option value="surgeon">Surgeon</option>
			<option value="gastroenterologist">Gastroenterologist</option>
			<option value="radiographer">Radiographer</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Registration body" inputId="registrationBody">
		<Select id="registrationBody" label="Registration body" bind:value={d.registrationBody}>
			<option value="">Select…</option>
			<option value="GMC">GMC</option>
			<option value="HCPC">HCPC</option>
			<option value="NMC">NMC</option>
			<option value="other">Other</option>
		</Select>
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

	<Field label="Site / referring location" inputId="siteName">
		<TextInput
			id="siteName"
			label="Site / referring location"
			placeholder="e.g. Headington Medical Practice"
			bind:value={d.siteName}
		/>
	</Field>

	<Field label="Referral date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral date" bind:value={d.referralDate} />
	</Field>
</Fieldset>
