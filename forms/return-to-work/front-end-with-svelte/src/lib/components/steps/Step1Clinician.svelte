<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const c = assessment.data.clinician;
</script>

<Fieldset legend="Clinician identification">
	<p class="hint">The clinician who examined the patient and signs this statement of fitness for work.</p>

	<Field label="Clinician name" inputId="clinicianName" required>
		<TextInput id="clinicianName" label="Clinician name" bind:value={c.name} required />
	</Field>

	<Field label="Role" inputId="clinicianRole">
		<Select id="clinicianRole" label="Role" bind:value={c.role}>
			<option value="">-- Select --</option>
			<option value="gp">General Practitioner</option>
			<option value="oh-physician">Occupational-Health Physician</option>
			<option value="hospital-consultant">Hospital Consultant</option>
			<option value="nurse">Registered Nurse</option>
			<option value="pharmacist">Pharmacist</option>
			<option value="physiotherapist">Physiotherapist</option>
			<option value="occupational-therapist">Occupational Therapist</option>
		</Select>
	</Field>

	<Field label="Registration number (GMC / NMC / HCPC / GPhC)" inputId="clinicianReg">
		<TextInput id="clinicianReg" label="Registration number" placeholder="e.g. GMC1234567" bind:value={c.registrationNumber} />
	</Field>

	<Field label="Practice / site" inputId="clinicianSite">
		<TextInput id="clinicianSite" label="Practice / site" bind:value={c.site} />
	</Field>

	<Field label="Signature" inputId="clinicianSignature">
		<TextInput id="clinicianSignature" label="Signature" bind:value={c.signature} />
	</Field>

	<Field label="Date of assessment" inputId="clinicianDate">
		<DateInput id="clinicianDate" label="Date of assessment" bind:value={c.date} />
	</Field>
</Fieldset>
