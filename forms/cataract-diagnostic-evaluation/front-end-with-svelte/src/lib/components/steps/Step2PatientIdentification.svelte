<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Patients under 16 raise a paediatric safety flag, because LOCS III and this form's adult referral pathway are not validated for paediatric cataract.</p>

	<Field label="First name" inputId="patient-firstName" required>
		<TextInput id="patient-firstName" label="First name" bind:value={d.patient.firstName} required />
	</Field>
	<Field label="Last name" inputId="patient-lastName" required>
		<TextInput id="patient-lastName" label="Last name" bind:value={d.patient.lastName} required />
	</Field>
	<Field label="Date of birth" inputId="patient-birthDate">
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
		<TextInput id="patient-email" label="Email" bind:value={d.patient.email} />
	</Field>
	<Field label="Phone" inputId="patient-phone">
		<TextInput id="patient-phone" label="Phone" bind:value={d.patient.phone} />
	</Field>
</Fieldset>
