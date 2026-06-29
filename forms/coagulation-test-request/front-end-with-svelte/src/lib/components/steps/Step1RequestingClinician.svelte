<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const c = request.data.clinician;
</script>

<Fieldset legend="1. Requesting Clinician">
	<p class="hint">Identify the clinician raising this coagulation request.</p>

	<Field label="Clinician name" inputId="clinicianName" required>
		<TextInput id="clinicianName" label="Clinician name" bind:value={c.clinicianName} required />
	</Field>

	<Field label="Clinician role" inputId="clinicianRole">
		<Select id="clinicianRole" label="Clinician role" bind:value={c.clinicianRole}>
			<option value="">Select…</option>
			<option value="gp">GP</option>
			<option value="hospital-doctor">Hospital doctor</option>
			<option value="haematologist">Haematologist</option>
			<option value="nurse">Nurse</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<div class="grid gap-4 sm:grid-cols-2">
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
			<TextInput id="registrationNumber" label="Registration number" bind:value={c.registrationNumber} />
		</Field>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Requester contact (bleep / phone)" inputId="requesterContact">
			<TextInput id="requesterContact" label="Requester contact" bind:value={c.requesterContact} />
		</Field>
		<Field label="Supervising consultant" inputId="supervisingConsultant">
			<TextInput id="supervisingConsultant" label="Supervising consultant" bind:value={c.supervisingConsultant} />
		</Field>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Site / clinic name" inputId="clinicianSiteName">
			<TextInput id="clinicianSiteName" label="Site / clinic name" bind:value={c.siteName} />
		</Field>
		<Field label="Referral date" inputId="referralDate">
			<DateInput id="referralDate" label="Referral date" bind:value={c.referralDate} />
		</Field>
	</div>
</Fieldset>
