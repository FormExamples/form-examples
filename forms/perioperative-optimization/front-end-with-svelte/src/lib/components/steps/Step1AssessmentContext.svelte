<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="1. Assessment Context">
	<p class="hint">Who is assessing, where, and at what stage of the perioperative pathway.</p>

	<Field label="Assessor name" inputId="assessment-clinicianName" required>
		<TextInput id="assessment-clinicianName" label="Assessor name" bind:value={d.assessment.clinicianName} required />
	</Field>
	<Field label="Role" inputId="assessment-role" required>
		<Select id="assessment-role" label="Role" bind:value={d.assessment.role} required>
			<option value="">— Select —</option>
			{#each OPTIONS.role as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Registration body" inputId="assessment-registrationBody">
		<Select id="assessment-registrationBody" label="Registration body" bind:value={d.assessment.registrationBody}>
			<option value="">— Select —</option>
			{#each OPTIONS.registrationBody as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Registration number" inputId="assessment-registrationNumber">
		<TextInput id="assessment-registrationNumber" label="Registration number" bind:value={d.assessment.registrationNumber} />
	</Field>
	<Field label="Assessment date" inputId="assessment-assessmentDate" description="With the planned surgery date this sets the weeks available to optimise." required>
		<DateInput id="assessment-assessmentDate" label="Assessment date" bind:value={d.assessment.assessmentDate} required />
	</Field>
	<Field label="Assessment time" inputId="assessment-assessmentTime">
		<TextInput id="assessment-assessmentTime" type="time" label="Assessment time" bind:value={d.assessment.assessmentTime} />
	</Field>
	<Field label="Site" inputId="assessment-siteName">
		<TextInput id="assessment-siteName" label="Site" bind:value={d.assessment.siteName} />
	</Field>
	<Field label="Service" inputId="assessment-serviceName">
		<TextInput id="assessment-serviceName" label="Service" bind:value={d.assessment.serviceName} />
	</Field>
	<Field label="Pathway stage" inputId="assessment-pathwayStage">
		<Select id="assessment-pathwayStage" label="Pathway stage" bind:value={d.assessment.pathwayStage}>
			<option value="">— Select —</option>
			{#each OPTIONS.pathwayStage as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Assessment mode" inputId="assessment-assessmentMode">
		<Select id="assessment-assessmentMode" label="Assessment mode" bind:value={d.assessment.assessmentMode}>
			<option value="">— Select —</option>
			{#each OPTIONS.assessmentMode as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Referral source" inputId="assessment-referralSource">
		<Select id="assessment-referralSource" label="Referral source" bind:value={d.assessment.referralSource}>
			<option value="">— Select —</option>
			{#each OPTIONS.referralSource as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
