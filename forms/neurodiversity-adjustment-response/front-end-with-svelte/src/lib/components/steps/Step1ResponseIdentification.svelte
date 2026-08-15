<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="1. Response Identification">
	<p class="hint">Who authored the reply (the decision-maker), the originating request, and key dates.</p>

	<Field label="Responding manager / HR contact" inputId="managerName" required>
		<TextInput
			id="managerName"
			label="Responding manager / HR contact"
			placeholder="e.g. Priya Shah"
			bind:value={d.managerName}
			required
		/>
	</Field>

	<Field label="Role" inputId="managerRole">
		<Select id="managerRole" label="Role" bind:value={d.managerRole}>
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
			placeholder="e.g. Team Lead, Claims"
			bind:value={d.managerJobTitle}
		/>
	</Field>

	<Field label="Department" inputId="managerDepartment">
		<TextInput
			id="managerDepartment"
			label="Department"
			placeholder="e.g. Operations"
			bind:value={d.managerDepartment}
		/>
	</Field>

	<Field label="Originating request reference" inputId="requestReference">
		<TextInput
			id="requestReference"
			label="Originating request reference"
			placeholder="e.g. REQ-2026-0044"
			bind:value={d.requestReference}
		/>
	</Field>

	<Field label="Response status" inputId="responseStatus" required>
		<Select id="responseStatus" label="Response status" bind:value={d.responseStatus} required>
			<option value="">Select…</option>
			<option value="draft">Draft</option>
			<option value="agreed">Agreed</option>
			<option value="partially-agreed">Partially agreed</option>
			<option value="trial">Trial</option>
			<option value="declined">Declined</option>
			<option value="deferred">Deferred</option>
			<option value="cancelled">Cancelled</option>
		</Select>
	</Field>

	<Field label="Handling method" inputId="handlingMethod">
		<Select id="handlingMethod" label="Handling method" bind:value={d.handlingMethod}>
			<option value="">Select…</option>
			<option value="meeting">Meeting</option>
			<option value="occupational-health-referral">Occupational-health referral</option>
			<option value="email">Email</option>
			<option value="hr-review">HR review</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Assessed date" inputId="assessedDate" description="Date the request was assessed / discussed with the worker.">
		<DateInput id="assessedDate" label="Assessed date" bind:value={d.assessedDate} />
	</Field>

	<Field label="Responded date" inputId="respondedDate" description="Date the response was issued to the worker.">
		<DateInput id="respondedDate" label="Responded date" bind:value={d.respondedDate} />
	</Field>
</Fieldset>
