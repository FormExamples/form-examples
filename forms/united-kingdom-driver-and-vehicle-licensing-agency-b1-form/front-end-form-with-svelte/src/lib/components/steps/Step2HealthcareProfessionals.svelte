<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import EmailInput from '$lib/components/ui/EmailInput.svelte';
	import TelInput from '$lib/components/ui/TelInput.svelte';

	const gp = assessment.data.healthcareProfessionals.gp;
	const c = assessment.data.healthcareProfessionals.consultant;
</script>

<Fieldset legend="Part B — Healthcare Professionals">
	<p class="hint">Tell us about the healthcare professionals who treat you for this condition.</p>

	<h3 class="step-subhead">GP details</h3>
	<Field label="GP name" required inputId="gpName">
		<TextInput id="gpName" label="GP name" required bind:value={gp.gpName} />
	</Field>
	<Field label="Surgery name" required inputId="surgeryName">
		<TextInput id="surgeryName" label="Surgery name" required bind:value={gp.surgeryName} />
	</Field>
	<Field label="Address — line 1" inputId="gpAddr1">
		<TextInput id="gpAddr1" label="Address — line 1" bind:value={gp.addressLine1} />
	</Field>
	<Field label="Address — line 2" inputId="gpAddr2">
		<TextInput id="gpAddr2" label="Address — line 2" bind:value={gp.addressLine2} />
	</Field>
	<div class="field-grid">
		<Field label="Town" inputId="gpTown">
			<TextInput id="gpTown" label="Town" bind:value={gp.town} />
		</Field>
		<Field label="Postcode" required inputId="gpPostcode">
			<TextInput id="gpPostcode" label="Postcode" required bind:value={gp.postcode} />
		</Field>
	</div>
	<div class="field-grid">
		<Field label="Contact number" inputId="gpPhone">
			<TelInput id="gpPhone" label="Contact number" bind:value={gp.contactNumber} />
		</Field>
		<Field label="Email" inputId="gpEmail">
			<EmailInput id="gpEmail" label="Email" bind:value={gp.email} />
		</Field>
	</div>
	<Field label="Date last seen for this condition" required inputId="gpLastSeen">
		<DateInput id="gpLastSeen" label="Date last seen" required bind:value={gp.dateLastSeen} />
	</Field>

	<h3 class="step-subhead">Consultant details</h3>
	<p class="hint">Leave blank if you have not seen a consultant for this condition.</p>
	<Field label="Consultant name" inputId="consName">
		<TextInput id="consName" label="Consultant name" bind:value={c.consultantName} />
	</Field>
	<Field label="Speciality" inputId="consSpec">
		<TextInput id="consSpec" label="Speciality" bind:value={c.speciality} />
	</Field>
	<Field label="Department" inputId="consDept">
		<TextInput id="consDept" label="Department" bind:value={c.department} />
	</Field>
	<Field label="Hospital name" inputId="consHosp">
		<TextInput id="consHosp" label="Hospital name" bind:value={c.hospitalName} />
	</Field>
	<Field label="Address — line 1" inputId="consAddr1">
		<TextInput id="consAddr1" label="Address — line 1" bind:value={c.addressLine1} />
	</Field>
	<Field label="Address — line 2" inputId="consAddr2">
		<TextInput id="consAddr2" label="Address — line 2" bind:value={c.addressLine2} />
	</Field>
	<div class="field-grid">
		<Field label="Town" inputId="consTown">
			<TextInput id="consTown" label="Town" bind:value={c.town} />
		</Field>
		<Field label="Postcode" inputId="consPostcode">
			<TextInput id="consPostcode" label="Postcode" bind:value={c.postcode} />
		</Field>
	</div>
	<div class="field-grid">
		<Field label="Contact number" inputId="consPhone">
			<TelInput id="consPhone" label="Contact number" bind:value={c.contactNumber} />
		</Field>
		<Field label="Email" inputId="consEmail">
			<EmailInput id="consEmail" label="Email" bind:value={c.email} />
		</Field>
	</div>
	<Field label="Date last seen for this condition" inputId="consLastSeen">
		<DateInput id="consLastSeen" label="Date last seen" bind:value={c.dateLastSeen} />
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	.step-subhead { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
