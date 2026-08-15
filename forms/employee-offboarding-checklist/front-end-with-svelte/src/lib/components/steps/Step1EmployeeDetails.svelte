<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.employeeDetails;
</script>

<Fieldset legend="Employee Details">
	<p class="hint">Identify the departing employee and the reason for leaving.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
		<Field label="Employee ID" inputId="employeeId">
			<TextInput id="employeeId" label="Employee ID" bind:value={d.employeeId} />
		</Field>
		<Field label="Work email" inputId="email">
			<TextInput id="email" label="Work email" bind:value={d.email} />
		</Field>
		<Field label="Job title" inputId="jobTitle">
			<TextInput id="jobTitle" label="Job title" bind:value={d.jobTitle} />
		</Field>
		<Field label="Department" inputId="department">
			<TextInput id="department" label="Department" bind:value={d.department} />
		</Field>
		<Field label="Line manager" inputId="lineManager">
			<TextInput id="lineManager" label="Line manager" bind:value={d.lineManager} />
		</Field>
		<Field label="Start date" inputId="startDate">
			<DateInput id="startDate" label="Start date" bind:value={d.startDate} />
		</Field>
		<Field label="Last working day" required inputId="lastWorkingDay">
			<DateInput id="lastWorkingDay" label="Last working day" required bind:value={d.lastWorkingDay} />
		</Field>
		<Field label="Reason for leaving" required inputId="reasonForLeaving">
			<Select id="reasonForLeaving" label="Reason for leaving" bind:value={d.reasonForLeaving}>
				<option value="">Select…</option>
				<option value="resignation">Resignation</option>
				<option value="retirement">Retirement</option>
				<option value="redundancy">Redundancy</option>
				<option value="dismissal">Dismissal</option>
				<option value="end-of-fixed-term">End of fixed term</option>
				<option value="transfer">Transfer</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	</div>

	{#if d.reasonForLeaving === 'other'}
		<Field label="Reason for leaving (other)" inputId="reasonForLeavingOther">
			<TextInput id="reasonForLeavingOther" label="Reason for leaving (other)" bind:value={d.reasonForLeavingOther} />
		</Field>
	{/if}

	<Field label="Notes" inputId="employeeDetailsNotes">
		<TextAreaInput id="employeeDetailsNotes" label="Notes" rows={3} bind:value={d.employeeDetailsNotes} />
	</Field>
</Fieldset>
