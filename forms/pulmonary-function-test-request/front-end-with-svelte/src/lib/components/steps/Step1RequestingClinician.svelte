<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.clinician;
</script>

<Fieldset legend="1. Requesting Clinician">
	<p class="hint">Identify the clinician making this referral.</p>

	<Field label="Clinician name" inputId="clinicianName" required>
		<TextInput
			id="clinicianName"
			label="Clinician name"
			placeholder="e.g. Dr Sarah Owen"
			bind:value={d.clinicianName}
			required
		/>
	</Field>

	<Field label="Clinician role" inputId="clinicianRole">
		<Select label="Clinician role" id="clinicianRole" bind:value={d.clinicianRole}>
			<option value="">— Select —</option>
			<option value="respiratory-physician">Respiratory physician</option>
			<option value="gp">GP</option>
			<option value="hospital-doctor">Hospital doctor</option>
			<option value="physiologist">Respiratory physiologist</option>
			<option value="nurse">Nurse</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Registration body" inputId="registrationBody">
		<Select label="Registration body" id="registrationBody" bind:value={d.registrationBody}>
			<option value="">— Select —</option>
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
			bind:value={d.registrationNumber}
		/>
	</Field>

	<Field label="Requester contact" inputId="requesterContact" description="Bleep / phone for vetting queries.">
		<TextInput
			id="requesterContact"
			label="Requester contact"
			placeholder="e.g. email or bleep"
			bind:value={d.requesterContact}
		/>
	</Field>

	<Field label="Supervising consultant" inputId="supervisingConsultant" description="If the referrer is in training.">
		<TextInput
			id="supervisingConsultant"
			label="Supervising consultant"
			bind:value={d.supervisingConsultant}
		/>
	</Field>

	<Field label="Site / clinic name" inputId="siteName">
		<TextInput id="siteName" label="Site / clinic name" bind:value={d.siteName} />
	</Field>

	<Field label="Referral date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral date" bind:value={d.referralDate} />
	</Field>
</Fieldset>
