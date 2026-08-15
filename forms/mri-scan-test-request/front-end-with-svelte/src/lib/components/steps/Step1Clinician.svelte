<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = request.data.clinician;

	const roleOptions = [
		{ value: 'radiologist', label: 'Radiologist' },
		{ value: 'gp', label: 'GP' },
		{ value: 'hospital-doctor', label: 'Hospital doctor' },
		{ value: 'neurologist', label: 'Neurologist' },
		{ value: 'orthopaedic-surgeon', label: 'Orthopaedic surgeon' },
		{ value: 'oncologist', label: 'Oncologist' },
		{ value: 'radiographer', label: 'Radiographer' },
		{ value: 'other', label: 'Other' }
	];

	const registrationBodyOptions = [
		{ value: 'GMC', label: 'GMC' },
		{ value: 'HCPC', label: 'HCPC' },
		{ value: 'NMC', label: 'NMC' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Requesting clinician">
	<p class="hint">Identify the clinician making this referral.</p>

	<Field label="Clinician name" required inputId="clinicianName">
		<TextInput id="clinicianName" label="Clinician name" required bind:value={d.clinicianName} />
	</Field>

	<Field label="Clinician role" inputId="clinicianRole">
		<Select id="clinicianRole" label="Clinician role" bind:value={d.clinicianRole}>
			<option value="">— Select —</option>
			{#each roleOptions as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="Registration body" inputId="registrationBody">
			<Select id="registrationBody" label="Registration body" bind:value={d.registrationBody}>
				<option value="">— Select —</option>
				{#each registrationBodyOptions as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Registration number" inputId="registrationNumber">
			<TextInput id="registrationNumber" label="Registration number" bind:value={d.registrationNumber} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Requester contact (bleep / phone)" inputId="requesterContact">
			<TextInput id="requesterContact" label="Requester contact" bind:value={d.requesterContact} />
		</Field>
		<Field label="Supervising consultant" inputId="supervisingConsultant">
			<TextInput id="supervisingConsultant" label="Supervising consultant" bind:value={d.supervisingConsultant} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Site / clinic name" inputId="clinicianSiteName">
			<TextInput id="clinicianSiteName" label="Site / clinic name" bind:value={d.siteName} />
		</Field>
		<Field label="Referral date" inputId="referralDate">
			<DateInput id="referralDate" label="Referral date" bind:value={d.referralDate} />
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
