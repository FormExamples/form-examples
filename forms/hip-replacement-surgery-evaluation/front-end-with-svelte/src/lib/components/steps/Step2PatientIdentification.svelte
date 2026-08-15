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
	const result = $derived(evaluationStore.result);
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Demographics and the height and weight used to compute body mass index.</p>

	<Field label="Name" inputId="patient-name" required>
		<TextInput id="patient-name" label="Name" bind:value={d.patient.name} required />
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
		<TextInput id="patient-email" type="email" label="Email" bind:value={d.patient.email} />
	</Field>
	<Field label="Phone" inputId="patient-phone">
		<TextInput id="patient-phone" type="tel" label="Phone" bind:value={d.patient.phone} />
	</Field>
	<Field label="Height (cm)" inputId="patient-heightAsCm">
		<NumberInput id="patient-heightAsCm" label="Height (cm)" min={50} max={250} step="0.1" bind:value={d.patient.heightAsCm} />
	</Field>
	<Field label="Weight (kg)" inputId="patient-weightAsKg">
		<NumberInput id="patient-weightAsKg" label="Weight (kg)" min={15} max={400} step="0.1" bind:value={d.patient.weightAsKg} />
	</Field>
	<Field label="Body mass index" inputId="patient-bmi" description="Computed from height and weight; the high-bmi-surgical-risk flag fires at 40 or above.">
		<TextInput
			id="patient-bmi"
			label="Body mass index"
			value={result.bmi === null ? '—' : `${result.bmi} kg/m²`}
			readonly
		/>
	</Field>
</Fieldset>
