<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.clinician;

	const roleOptions = [
		{ value: 'doctor', label: 'Doctor' },
		{ value: 'nurse', label: 'Nurse' },
		{ value: 'midwife', label: 'Midwife' },
		{ value: 'operating-department-practitioner', label: 'Operating-department practitioner' },
		{ value: 'biomedical-scientist', label: 'Biomedical scientist' },
		{ value: 'other', label: 'Other' }
	];
	const bodyOptions = [
		{ value: 'GMC', label: 'GMC' },
		{ value: 'NMC', label: 'NMC' },
		{ value: 'HCPC', label: 'HCPC' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Step 1 of 7 · Requesting clinician">
	<p class="hint">Identify the clinician making this referral.</p>

	<Field label="Clinician name" required inputId="clinician-clinicianName">
		<TextInput id="clinician-clinicianName" label="Clinician name" required bind:value={d.clinicianName} />
	</Field>

	<Field label="Clinician role" inputId="clinician-clinicianRole">
		<Select id="clinician-clinicianRole" label="Clinician role" bind:value={d.clinicianRole}>
			<option value="">— Select —</option>
			{#each roleOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="Registration body" inputId="clinician-registrationBody">
			<Select id="clinician-registrationBody" label="Registration body" bind:value={d.registrationBody}>
				<option value="">— Select —</option>
				{#each bodyOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Registration number" inputId="clinician-registrationNumber">
			<TextInput id="clinician-registrationNumber" label="Registration number" bind:value={d.registrationNumber} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Requester contact (bleep / phone)" inputId="clinician-requesterContact">
			<TextInput id="clinician-requesterContact" label="Requester contact" bind:value={d.requesterContact} />
		</Field>
		<Field label="Supervising consultant" inputId="clinician-supervisingConsultant">
			<TextInput id="clinician-supervisingConsultant" label="Supervising consultant" bind:value={d.supervisingConsultant} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Site / clinic name" inputId="clinician-siteName">
			<TextInput id="clinician-siteName" label="Site / clinic name" bind:value={d.siteName} />
		</Field>
		<Field label="Referral date" inputId="clinician-referralDate">
			<DateInput id="clinician-referralDate" label="Referral date" bind:value={d.referralDate} />
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
