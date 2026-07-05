<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data;
</script>

<Fieldset legend="1. Worker and Role">
	<p class="hint">The neurodivergent worker the request is for, and their role.</p>

	<Field label="Worker name" inputId="workerName" required>
		<TextInput
			id="workerName"
			label="Worker name"
			placeholder="e.g. Alex Rivera"
			bind:value={d.workerName}
			required
		/>
	</Field>

	<Field label="Job title" inputId="workerJobTitle" required>
		<TextInput
			id="workerJobTitle"
			label="Job title"
			placeholder="e.g. Software developer"
			bind:value={d.workerJobTitle}
			required
		/>
	</Field>

	<Field label="Department / team" inputId="workerDepartment">
		<TextInput
			id="workerDepartment"
			label="Department / team"
			placeholder="e.g. Engineering"
			bind:value={d.workerDepartment}
		/>
	</Field>

	<Field label="Employment type" inputId="employmentType">
		<Select id="employmentType" label="Employment type" bind:value={d.employmentType}>
			<option value="">Select…</option>
			<option value="permanent">Permanent</option>
			<option value="fixed-term">Fixed-term</option>
			<option value="agency">Agency</option>
			<option value="contractor">Contractor</option>
			<option value="apprentice">Apprentice</option>
			<option value="volunteer">Volunteer</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Work pattern" inputId="workPattern">
		<Select id="workPattern" label="Work pattern" bind:value={d.workPattern}>
			<option value="">Select…</option>
			<option value="full-time">Full-time</option>
			<option value="part-time">Part-time</option>
			<option value="shift">Shift</option>
			<option value="flexible">Flexible</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Work location" inputId="workLocation">
		<Select id="workLocation" label="Work location" bind:value={d.workLocation}>
			<option value="">Select…</option>
			<option value="office">Office</option>
			<option value="remote">Remote</option>
			<option value="hybrid">Hybrid</option>
			<option value="field">Field</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Employment start date" inputId="employmentStartDate">
		<DateInput
			id="employmentStartDate"
			label="Employment start date"
			bind:value={d.employmentStartDate}
		/>
	</Field>

	<Field label="Employee reference" inputId="employeeReference" description="Employer-assigned payroll / staff reference.">
		<TextInput
			id="employeeReference"
			label="Employee reference"
			placeholder="e.g. EMP-00421"
			bind:value={d.employeeReference}
		/>
	</Field>

	<Field label="Worker email" inputId="workerEmail">
		<TextInput
			id="workerEmail"
			label="Worker email"
			placeholder="e.g. alex.rivera@example.com"
			bind:value={d.workerEmail}
		/>
	</Field>

	<Field label="Worker phone" inputId="workerPhone">
		<TextInput
			id="workerPhone"
			label="Worker phone"
			placeholder="e.g. 07700 900000"
			bind:value={d.workerPhone}
		/>
	</Field>
</Fieldset>
