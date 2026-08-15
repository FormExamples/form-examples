<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import EmailInput from '#lib/components/ui/EmailInput.svelte';
	import TelInput from '#lib/components/ui/TelInput.svelte';

	const gp = assessment.data.healthcareProfessionals.gp;
	const con = assessment.data.healthcareProfessionals.consultant;
</script>

<Fieldset legend="Part B — Healthcare Professional">
	<p class="hint">GP and consultant details for your mental health condition.</p>

	<h3 class="step-subhead">GP details</h3>

	<Field label="GP name" inputId="gpName">
		<TextInput id="gpName" label="GP name" bind:value={gp.gpName} />
	</Field>
	<Field label="Surgery name" inputId="gpSurgeryName">
		<TextInput id="gpSurgeryName" label="Surgery name" bind:value={gp.surgeryName} />
	</Field>
	<Field label="Address" inputId="gpAddress">
		<TextAreaInput id="gpAddress" label="Address" rows={2} bind:value={gp.address} />
	</Field>

	<div class="field-grid">
		<Field label="Town" inputId="gpTown">
			<TextInput id="gpTown" label="Town" bind:value={gp.town} />
		</Field>
		<Field label="Postcode" inputId="gpPostcode">
			<TextInput id="gpPostcode" label="Postcode" bind:value={gp.postcode} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Contact number" inputId="gpContactNumber">
			<TelInput id="gpContactNumber" label="Contact number" bind:value={gp.contactNumber} />
		</Field>
		<Field label="Email (if known)" inputId="gpEmail">
			<EmailInput id="gpEmail" label="Email" bind:value={gp.email} />
		</Field>
	</div>

	<Field label="Date last seen for this condition" inputId="gpDateLastSeen">
		<DateInput id="gpDateLastSeen" label="Date last seen" bind:value={gp.dateLastSeen} />
	</Field>

	<h3 class="step-subhead">Consultant details</h3>

	<Field label="Consultant name" inputId="consultantName">
		<TextInput id="consultantName" label="Consultant name" bind:value={con.consultantName} />
	</Field>
	<div class="field-grid">
		<Field label="Speciality" inputId="speciality">
			<TextInput id="speciality" label="Speciality" bind:value={con.speciality} />
		</Field>
		<Field label="Department" inputId="department">
			<TextInput id="department" label="Department" bind:value={con.department} />
		</Field>
	</div>
	<Field label="Hospital name" inputId="hospitalName">
		<TextInput id="hospitalName" label="Hospital name" bind:value={con.hospitalName} />
	</Field>
	<Field label="Address" inputId="consultantAddress">
		<TextAreaInput id="consultantAddress" label="Address" rows={2} bind:value={con.address} />
	</Field>

	<div class="field-grid">
		<Field label="Town" inputId="consultantTown">
			<TextInput id="consultantTown" label="Town" bind:value={con.town} />
		</Field>
		<Field label="Postcode" inputId="consultantPostcode">
			<TextInput id="consultantPostcode" label="Postcode" bind:value={con.postcode} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Contact number" inputId="consultantContactNumber">
			<TelInput id="consultantContactNumber" label="Contact number" bind:value={con.contactNumber} />
		</Field>
		<Field label="Email (if known)" inputId="consultantEmail">
			<EmailInput id="consultantEmail" label="Email" bind:value={con.email} />
		</Field>
	</div>

	<Field label="Date last seen for this condition" inputId="consultantDateLastSeen">
		<DateInput id="consultantDateLastSeen" label="Date last seen" bind:value={con.dateLastSeen} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.step-subhead {
		font-size: 1rem;
		font-weight: 600;
		margin: 1.25rem 0 0.5rem;
	}
	@media (max-width: 640px) {
		.field-grid { grid-template-columns: 1fr; }
	}
</style>
