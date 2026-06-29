<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = request.data.clinician;
</script>

<Fieldset legend="Requesting clinician">
	<p class="hint">Identify the clinician making this referral.</p>

	<Field label="Clinician name" required inputId="clinicianName">
		<TextInput id="clinicianName" label="Clinician name" required bind:value={c.clinicianName} />
	</Field>

	<Field label="Clinician role" inputId="clinicianRole">
		<Select id="clinicianRole" label="Clinician role" bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="radiologist">Radiologist</option>
			<option value="interventional-radiologist">Interventional radiologist</option>
			<option value="cardiologist">Cardiologist</option>
			<option value="vascular-surgeon">Vascular surgeon</option>
			<option value="gp">GP</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="Registration body" inputId="registrationBody">
			<Select id="registrationBody" label="Registration body" bind:value={c.registrationBody}>
				<option value="">— Select —</option>
				<option value="GMC">GMC</option>
				<option value="HCPC">HCPC</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Registration number" inputId="registrationNumber">
			<TextInput id="registrationNumber" label="Registration number" bind:value={c.registrationNumber} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Requester contact (bleep / phone)" inputId="requesterContact">
			<TextInput id="requesterContact" label="Requester contact" bind:value={c.requesterContact} />
		</Field>
		<Field label="Supervising consultant" inputId="supervisingConsultant">
			<TextInput id="supervisingConsultant" label="Supervising consultant" bind:value={c.supervisingConsultant} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Site / clinic name" inputId="siteName">
			<TextInput id="siteName" label="Site / clinic name" bind:value={c.siteName} />
		</Field>
		<Field label="Referral date" inputId="referralDate">
			<DateInput id="referralDate" label="Referral date" bind:value={c.referralDate} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
