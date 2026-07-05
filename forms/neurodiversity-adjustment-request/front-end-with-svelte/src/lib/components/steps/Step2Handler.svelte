<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data;
</script>

<Fieldset legend="2. Handler">
	<p class="hint">The manager / HR contact handling the request, and who is making it.</p>

	<Field label="Manager / HR contact name" inputId="managerName" required>
		<TextInput
			id="managerName"
			label="Manager / HR contact name"
			placeholder="e.g. Priya Shah"
			bind:value={d.managerName}
			required
		/>
	</Field>

	<Field label="Contact role" inputId="managerRole">
		<Select id="managerRole" label="Contact role" bind:value={d.managerRole}>
			<option value="">Select…</option>
			<option value="line-manager">Line manager</option>
			<option value="hr-adviser">HR adviser</option>
			<option value="occupational-health">Occupational health</option>
			<option value="diversity-lead">Diversity lead</option>
			<option value="senior-manager">Senior manager</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Job title" inputId="managerJobTitle">
		<TextInput
			id="managerJobTitle"
			label="Job title"
			placeholder="e.g. Engineering manager"
			bind:value={d.managerJobTitle}
		/>
	</Field>

	<Field label="Department" inputId="managerDepartment">
		<TextInput
			id="managerDepartment"
			label="Department"
			placeholder="e.g. People and Culture"
			bind:value={d.managerDepartment}
		/>
	</Field>

	<Field label="Contact email" inputId="managerEmail">
		<TextInput
			id="managerEmail"
			label="Contact email"
			placeholder="e.g. priya.shah@example.com"
			bind:value={d.managerEmail}
		/>
	</Field>

	<Field label="Contact phone" inputId="managerPhone">
		<TextInput
			id="managerPhone"
			label="Contact phone"
			placeholder="e.g. 07700 900111"
			bind:value={d.managerPhone}
		/>
	</Field>

	<Field label="Request made by" inputId="requestedBy" description="Who is raising this request.">
		<Select id="requestedBy" label="Request made by" bind:value={d.requestedBy}>
			<option value="worker">Worker</option>
			<option value="manager">Manager</option>
			<option value="occupational-health">Occupational health</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Request status" inputId="status">
		<Select id="status" label="Request status" bind:value={d.status}>
			<option value="draft">Draft</option>
			<option value="submitted">Submitted</option>
			<option value="under-review">Under review</option>
			<option value="agreed">Agreed</option>
			<option value="partially-agreed">Partially agreed</option>
			<option value="declined">Declined</option>
			<option value="withdrawn">Withdrawn</option>
		</Select>
	</Field>

	<Field label="Request date" inputId="requestDate">
		<DateInput id="requestDate" label="Request date" bind:value={d.requestDate} />
	</Field>

	<Field label="Requested start date" inputId="requestedStartDate" description="Proposed date for the adjustments to start.">
		<DateInput
			id="requestedStartDate"
			label="Requested start date"
			bind:value={d.requestedStartDate}
		/>
	</Field>
</Fieldset>
