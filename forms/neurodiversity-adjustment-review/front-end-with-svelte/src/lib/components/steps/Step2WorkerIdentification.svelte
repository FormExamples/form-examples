<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Worker Identification">
	<p class="hint">Identify the worker this review relates to.</p>

	<Field label="Worker name" inputId="workerName" required>
		<TextInput
			id="workerName"
			label="Worker name"
			placeholder="e.g. Sam Taylor"
			bind:value={d.workerName}
			required
		/>
	</Field>

	<Field label="Job title" inputId="workerJobTitle">
		<TextInput
			id="workerJobTitle"
			label="Job title"
			placeholder="e.g. Claims Handler"
			bind:value={d.workerJobTitle}
		/>
	</Field>

	<Field label="Department" inputId="workerDepartment">
		<TextInput
			id="workerDepartment"
			label="Department"
			placeholder="e.g. Operations"
			bind:value={d.workerDepartment}
		/>
	</Field>

	<Field
		label="Employee reference"
		inputId="employeeReference"
		description="The employer-assigned employee / payroll reference."
	>
		<TextInput
			id="employeeReference"
			label="Employee reference"
			placeholder="e.g. EMP-88213"
			bind:value={d.employeeReference}
		/>
	</Field>

	<Field label="Worker email" inputId="workerEmail">
		<TextInput
			id="workerEmail"
			label="Worker email"
			placeholder="e.g. sam.taylor@example.org"
			bind:value={d.workerEmail}
		/>
	</Field>

	<Field label="Worker phone" inputId="workerPhone">
		<TextInput id="workerPhone" label="Worker phone" bind:value={d.workerPhone} />
	</Field>
</Fieldset>
