<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const p = assessment.data.patient;
</script>

<Fieldset legend="Patient identification">
	<p class="hint">The employee who has been examined.</p>

	<Field label="NHS number" inputId="nhsNumber">
		<TextInput id="nhsNumber" label="NHS number" placeholder="000 000 0000" bind:value={p.nhsNumber} />
	</Field>

	<Field label="First name" inputId="firstName">
		<TextInput id="firstName" label="First name" bind:value={p.firstName} />
	</Field>

	<Field label="Last name" inputId="lastName" required>
		<TextInput id="lastName" label="Last name" bind:value={p.lastName} required />
	</Field>

	<Field label="Date of birth" inputId="dob" required>
		<DateInput id="dob" label="Date of birth" bind:value={p.dateOfBirth} required />
	</Field>

	<Field label="Sex" inputId="sex">
		<Select id="sex" label="Sex" bind:value={p.sex}>
			<option value="">-- Select --</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Phone" inputId="phone">
		<TextInput id="phone" label="Phone" bind:value={p.phone} />
	</Field>

	<Field label="Email" inputId="email">
		<TextInput id="email" label="Email" bind:value={p.email} />
	</Field>

	<Field label="Employer name" inputId="employerName">
		<TextInput id="employerName" label="Employer name" bind:value={p.employerName} />
	</Field>

	<Field label="Employer occupational-health contact" inputId="employerOhContact">
		<TextInput id="employerOhContact" label="Employer occupational-health contact" bind:value={p.employerOhContact} />
	</Field>
</Fieldset>
