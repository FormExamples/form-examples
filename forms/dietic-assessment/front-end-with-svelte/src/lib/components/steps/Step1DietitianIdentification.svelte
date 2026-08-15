<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="1. Dietitian Identification">
	<p class="hint">Who is conducting the assessment, where, and for how long.</p>

	<Field label="Dietitian name" inputId="dietitian-dietitianName" required>
		<TextInput id="dietitian-dietitianName" label="Dietitian name" bind:value={d.dietitian.dietitianName} required />
	</Field>
	<Field label="Role" inputId="dietitian-role" required>
		<Select id="dietitian-role" label="Role" bind:value={d.dietitian.role} required>
			<option value="">— Select —</option>
			{#each OPTIONS.role as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Specialty" inputId="dietitian-specialty">
		<Select id="dietitian-specialty" label="Specialty" bind:value={d.dietitian.specialty}>
			<option value="">— Select —</option>
			{#each OPTIONS.specialty as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Registration body" inputId="dietitian-registrationBody">
		<Select id="dietitian-registrationBody" label="Registration body" bind:value={d.dietitian.registrationBody}>
			<option value="">— Select —</option>
			{#each OPTIONS.registrationBody as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Registration number" inputId="dietitian-registrationNumber">
		<TextInput id="dietitian-registrationNumber" label="Registration number" bind:value={d.dietitian.registrationNumber} />
	</Field>
	<Field label="Assessment date" inputId="dietitian-assessmentDate" required>
		<DateInput id="dietitian-assessmentDate" label="Assessment date" bind:value={d.dietitian.assessmentDate} required />
	</Field>
	<Field label="Assessment time" inputId="dietitian-assessmentTime">
		<TextInput id="dietitian-assessmentTime" type="time" label="Assessment time" bind:value={d.dietitian.assessmentTime} />
	</Field>
	<Field label="Site" inputId="dietitian-siteName">
		<TextInput id="dietitian-siteName" label="Site" bind:value={d.dietitian.siteName} />
	</Field>
	<Field label="Service" inputId="dietitian-serviceName">
		<TextInput id="dietitian-serviceName" label="Service" bind:value={d.dietitian.serviceName} />
	</Field>
	<Field label="Setting" inputId="dietitian-setting">
		<Select id="dietitian-setting" label="Setting" bind:value={d.dietitian.setting}>
			<option value="">— Select —</option>
			{#each OPTIONS.setting as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Appointment type" inputId="dietitian-appointmentType">
		<Select id="dietitian-appointmentType" label="Appointment type" bind:value={d.dietitian.appointmentType}>
			<option value="">— Select —</option>
			{#each OPTIONS.appointmentType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Planned duration (minutes)" inputId="dietitian-plannedDurationMinutes" description="Typically 45 to 60 for an initial appointment, up to 90 for a specialist programme.">
		<NumberInput id="dietitian-plannedDurationMinutes" label="Planned duration (minutes)" min={5} max={240} bind:value={d.dietitian.plannedDurationMinutes} />
	</Field>
	<Field label="Interpreter required" inputId="dietitian-interpreterRequired">
		<Select id="dietitian-interpreterRequired" label="Interpreter required" bind:value={d.dietitian.interpreterRequired}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Interpreter language" inputId="dietitian-interpreterLanguage">
		<TextInput id="dietitian-interpreterLanguage" label="Interpreter language" bind:value={d.dietitian.interpreterLanguage} />
	</Field>
</Fieldset>
