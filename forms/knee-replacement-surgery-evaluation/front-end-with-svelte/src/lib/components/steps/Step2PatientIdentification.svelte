<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Who the patient is and their body measurements.</p>

	<Field label="Name" inputId="patient-name" required>
		<TextInput id="patient-name" label="Name" bind:value={d.patient.name} required />
	</Field>
	<Field label="Date of birth" inputId="patient-birthDate" description="Used for the paediatric safety flag: the Oxford Knee Score is not validated below 16 years.">
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
		<TextInput id="patient-nhsNumber" label="NHS number" placeholder="NNN NNN NNNN" bind:value={d.patient.nhsNumber} />
	</Field>
	<Field label="Email" inputId="patient-email">
		<TextInput id="patient-email" type="email" label="Email" bind:value={d.patient.email} />
	</Field>
	<Field label="Phone" inputId="patient-phone">
		<TextInput id="patient-phone" type="tel" label="Phone" bind:value={d.patient.phone} />
	</Field>
	<Field label="Height (cm)" inputId="patient-heightAsCm" description="Used with weight to calculate body mass index for the high-bmi-surgical-risk safety flag.">
		<NumberInput id="patient-heightAsCm" label="Height (cm)" min={50} max={250} step={0.1} bind:value={d.patient.heightAsCm} />
	</Field>
	<Field label="Weight (kg)" inputId="patient-weightAsKg">
		<NumberInput id="patient-weightAsKg" label="Weight (kg)" min={10} max={400} step={0.1} bind:value={d.patient.weightAsKg} />
	</Field>
	<Field label="Preferred language" inputId="patient-preferredLanguage">
		<TextInput id="patient-preferredLanguage" label="Preferred language" bind:value={d.patient.preferredLanguage} />
	</Field>
</Fieldset>
