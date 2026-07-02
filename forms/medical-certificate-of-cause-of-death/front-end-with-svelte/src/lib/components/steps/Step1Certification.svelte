<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const c = assessment.data.certification;
</script>

<Fieldset legend="Step 1 of 6 — Certification context">
	<p class="hint">The certifying doctor, their registration, and the certification date.</p>

	<Field label="Certifying doctor — name" inputId="certification-certifyingDoctorName">
		<TextInput
			id="certification-certifyingDoctorName"
			label="Certifying doctor — name"
			placeholder="Name of the attending practitioner"
			bind:value={c.certifyingDoctorName}
		/>
	</Field>

	<Field label="Certifying doctor — grade" inputId="certification-certifyingDoctorGrade">
		<Select
			id="certification-certifyingDoctorGrade"
			label="Certifying doctor — grade"
			bind:value={c.certifyingDoctorGrade}
		>
			<option value="">— Select —</option>
			<option value="consultant">Consultant</option>
			<option value="sas">SAS doctor</option>
			<option value="registrar">Registrar</option>
			<option value="foundation">Foundation doctor</option>
			<option value="gp">General practitioner</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="GMC reference number" inputId="certification-gmcReference">
		<TextInput
			id="certification-gmcReference"
			label="GMC reference number"
			placeholder="GMC registration number"
			bind:value={c.gmcReference}
		/>
	</Field>

	<Field label="Place of certification" inputId="certification-placeOfCertification">
		<TextInput
			id="certification-placeOfCertification"
			label="Place of certification"
			placeholder="Hospital, practice, or other"
			bind:value={c.placeOfCertification}
		/>
	</Field>

	<Field label="Date of certification" inputId="certification-certificationDate">
		<DateInput
			id="certification-certificationDate"
			label="Date of certification"
			bind:value={c.certificationDate}
		/>
	</Field>

	<Field
		label="Attended the deceased during the last illness?"
		inputId="certification-attendedDeceased"
	>
		<Select
			id="certification-attendedDeceased"
			label="Attended the deceased during the last illness?"
			bind:value={c.attendedDeceased}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Date last seen alive by the certifier"
		inputId="certification-lastSeenAliveDate"
	>
		<DateInput
			id="certification-lastSeenAliveDate"
			label="Date last seen alive by the certifier"
			bind:value={c.lastSeenAliveDate}
		/>
	</Field>
</Fieldset>
