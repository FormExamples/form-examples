<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { questionnaireStore } from '#lib/stores/questionnaire.svelte.js';

	const d = questionnaireStore.data;
</script>

<Fieldset legend="2. Personal Details">
	<p class="hint">Who is being screened, and their emergency contact.</p>

	<Field label="Name" inputId="patient-name" required>
		<TextInput id="patient-name" label="Name" bind:value={d.patient.name} required />
	</Field>
	<Field label="Date of birth" inputId="patient-birthDate"
		description="Used to compute age for the paediatric safety flag.">
		<DateInput id="patient-birthDate" label="Date of birth" bind:value={d.patient.birthDate} />
	</Field>
	<Field label="Sex" inputId="patient-sex" description="Used for the sex-adjusted AUDIT-C threshold.">
		<Select id="patient-sex" label="Sex" bind:value={d.patient.sex}>
			<option value="">— Select —</option>
			{#each OPTIONS.sex as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Identifier type" inputId="patient-identifierType">
		<Select id="patient-identifierType" label="Identifier type" bind:value={d.patient.identifierType}>
			<option value="">— Select —</option>
			{#each OPTIONS.identifierType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Identifier value" inputId="patient-identifierValue">
		<TextInput id="patient-identifierValue" label="Identifier value" bind:value={d.patient.identifierValue} />
	</Field>
	<Field label="Email" inputId="patient-email">
		<TextInput id="patient-email" label="Email" type="email" bind:value={d.patient.email} />
	</Field>
	<Field label="Phone" inputId="patient-phone">
		<TextInput id="patient-phone" label="Phone" bind:value={d.patient.phone} />
	</Field>
	<Field label="Emergency contact name" inputId="patient-emergencyContactName">
		<TextInput id="patient-emergencyContactName" label="Emergency contact name" bind:value={d.patient.emergencyContactName} />
	</Field>
	<Field label="Emergency contact relationship" inputId="patient-emergencyContactRelationship">
		<TextInput id="patient-emergencyContactRelationship" label="Emergency contact relationship" bind:value={d.patient.emergencyContactRelationship} />
	</Field>
	<Field label="Emergency contact phone" inputId="patient-emergencyContactPhone">
		<TextInput id="patient-emergencyContactPhone" label="Emergency contact phone" bind:value={d.patient.emergencyContactPhone} />
	</Field>
</Fieldset>
