<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TimeInput from '$lib/components/ui/TimeInput.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="1. Clinician Identification">
	<p class="hint">The clinician performing this cataract diagnostic evaluation, their registration, and when and where it took place.</p>

	<Field label="Clinician name" inputId="clinician-clinicianName" required>
		<TextInput id="clinician-clinicianName" label="Clinician name" bind:value={d.clinician.clinicianName} required />
	</Field>
	<Field label="Role" inputId="clinician-role">
		<Select id="clinician-role" label="Role" bind:value={d.clinician.role}>
			<option value="">— Select —</option>
			{#each OPTIONS.role as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Registration body" inputId="clinician-registrationBody">
		<Select id="clinician-registrationBody" label="Registration body" bind:value={d.clinician.registrationBody}>
			<option value="">— Select —</option>
			{#each OPTIONS.registrationBody as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Registration number" inputId="clinician-registrationNumber">
		<TextInput id="clinician-registrationNumber" label="Registration number" bind:value={d.clinician.registrationNumber} />
	</Field>
	<Field label="Site name" inputId="clinician-siteName">
		<TextInput id="clinician-siteName" label="Site name" bind:value={d.clinician.siteName} />
	</Field>
	<Field label="Assessment date" inputId="clinician-assessmentDate" required>
		<DateInput id="clinician-assessmentDate" label="Assessment date" bind:value={d.clinician.assessmentDate} required />
	</Field>
	<Field label="Assessment time" inputId="clinician-assessmentTime">
		<TimeInput id="clinician-assessmentTime" label="Assessment time" bind:value={d.clinician.assessmentTime} />
	</Field>
</Fieldset>
