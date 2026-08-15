<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/assessment.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Who is being examined.</p>

	<Field label="First name" inputId="patient-firstName" required>
		<TextInput id="patient-firstName" label="First name" bind:value={d.patient.firstName} required />
	</Field>
	<Field label="Last name" inputId="patient-lastName">
		<TextInput id="patient-lastName" label="Last name" bind:value={d.patient.lastName} />
	</Field>
	<Field label="Date of birth" inputId="patient-birthDate" description="Patients under 16 raise a paediatric safety flag.">
		<DateInput id="patient-birthDate" label="Date of birth" bind:value={d.patient.birthDate} />
	</Field>
	<Field label="Sex" inputId="patient-sex">
		<Select id="patient-sex" label="Sex" bind:value={d.patient.sex}>
			<option value="">— Select —</option>
			{#each OPTIONS.sex as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="NHS number" inputId="patient-nhsNumber">
		<TextInput id="patient-nhsNumber" label="NHS number" bind:value={d.patient.nhsNumber} />
	</Field>
	<Field label="Email" inputId="patient-email">
		<TextInput id="patient-email" type="email" label="Email" bind:value={d.patient.email} />
	</Field>
	<Field label="Phone" inputId="patient-phone">
		<TextInput id="patient-phone" type="tel" label="Phone" bind:value={d.patient.phone} />
	</Field>
</Fieldset>
