<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="1. Requesting Clinician">
	<p class="hint">Identify the clinician making this referral.</p>

	<Field label="Clinician name" inputId="clinicianName" required>
		<TextInput
			id="clinicianName"
			label="Clinician name"
			placeholder="e.g. Dr H Iqbal"
			bind:value={d.clinician.clinicianName}
			required
		/>
	</Field>

	<Field label="Clinician role" inputId="clinicianRole">
		<Select id="clinicianRole" label="Clinician role" bind:value={d.clinician.clinicianRole}>
			<option value="">Select…</option>
			<option value="obstetrician">Obstetrician</option>
			<option value="midwife">Midwife</option>
			<option value="gp">GP</option>
			<option value="fetal-medicine-specialist">Fetal-medicine specialist</option>
			<option value="gynaecologist">Gynaecologist</option>
			<option value="sonographer">Sonographer</option>
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
			bind:value={d.clinician.registrationNumber}
		/>
	</Field>

	<Field label="Requester contact (bleep / phone)" inputId="requesterContact">
		<TextInput
			id="requesterContact"
			label="Requester contact (bleep / phone)"
			bind:value={d.clinician.requesterContact}
		/>
	</Field>

	<Field label="Supervising consultant" inputId="supervisingConsultant">
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
