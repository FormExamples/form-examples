<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="2. Patient and Procedural Demographics">
	<p class="hint">Who the patient is and what they are listed for. The planned surgery date drives every domain gate.</p>

	<Field label="First name" inputId="patient-firstName" required>
		<TextInput id="patient-firstName" label="First name" bind:value={d.patient.firstName} required />
	</Field>
	<Field label="Last name" inputId="patient-lastName" required>
		<TextInput id="patient-lastName" label="Last name" bind:value={d.patient.lastName} required />
	</Field>
	<Field label="Date of birth" inputId="patient-birthDate">
		<DateInput id="patient-birthDate" label="Date of birth" bind:value={d.patient.birthDate} />
	</Field>
	<Field label="Sex" inputId="patient-sex" description="Sets the sex-specific haemoglobin and AUDIT-C thresholds.">
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
	<Field label="Phone" inputId="patient-phone">
		<TextInput id="patient-phone" label="Phone" bind:value={d.patient.phone} />
	</Field>
	<Field label="Email" inputId="patient-email">
		<TextInput id="patient-email" label="Email" bind:value={d.patient.email} />
	</Field>
	<Field label="Planned procedure" inputId="procedure-plannedProcedure" required>
		<TextInput id="procedure-plannedProcedure" label="Planned procedure" bind:value={d.procedure.plannedProcedure} required />
	</Field>
	<Field label="Surgical specialty" inputId="procedure-surgicalSpecialty">
		<TextInput id="procedure-surgicalSpecialty" label="Surgical specialty" bind:value={d.procedure.surgicalSpecialty} />
	</Field>
	<Field label="Consultant surgeon" inputId="procedure-consultantSurgeon">
		<TextInput id="procedure-consultantSurgeon" label="Consultant surgeon" bind:value={d.procedure.consultantSurgeon} />
	</Field>
	<Field label="Planned surgery date" inputId="procedure-plannedSurgeryDate" description="Leave blank if no date is set; gating is then skipped and every triggered domain reports action required.">
		<DateInput id="procedure-plannedSurgeryDate" label="Planned surgery date" bind:value={d.procedure.plannedSurgeryDate} />
	</Field>
	<Field label="Urgency" inputId="procedure-urgency">
		<Select id="procedure-urgency" label="Urgency" bind:value={d.procedure.urgency}>
			<option value="">— Select —</option>
			{#each OPTIONS.urgency as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Surgical severity" inputId="procedure-surgicalSeverity">
		<Select id="procedure-surgicalSeverity" label="Surgical severity" bind:value={d.procedure.surgicalSeverity}>
			<option value="">— Select —</option>
			{#each OPTIONS.surgicalSeverity as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Laterality" inputId="procedure-laterality">
		<Select id="procedure-laterality" label="Laterality" bind:value={d.procedure.laterality}>
			<option value="">— Select —</option>
			{#each OPTIONS.laterality as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Anticipated blood loss (ml)" inputId="procedure-anticipatedBloodLossMl">
		<NumberInput id="procedure-anticipatedBloodLossMl" label="Anticipated blood loss (ml)" min={0} max={20000} bind:value={d.procedure.anticipatedBloodLossMl} />
	</Field>
	<Field label="Anticipated stay (days)" inputId="procedure-anticipatedLengthOfStayDays">
		<NumberInput id="procedure-anticipatedLengthOfStayDays" label="Anticipated stay (days)" min={0} max={365} bind:value={d.procedure.anticipatedLengthOfStayDays} />
	</Field>
	<Field label="Interpreter required" inputId="procedure-interpreterRequired">
		<Select id="procedure-interpreterRequired" label="Interpreter required" bind:value={d.procedure.interpreterRequired}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Interpreter language" inputId="procedure-interpreterLanguage">
		<TextInput id="procedure-interpreterLanguage" label="Interpreter language" bind:value={d.procedure.interpreterLanguage} />
	</Field>
</Fieldset>
