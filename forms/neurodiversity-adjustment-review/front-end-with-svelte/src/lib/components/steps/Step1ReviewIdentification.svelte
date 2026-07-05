<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="1. Review Identification">
	<p class="hint">
		Who conducted the review (the reviewer), the originating response whose adjustments are being
		reviewed, and the review dates.
	</p>

	<Field label="Reviewer (manager / HR contact)" inputId="managerName" required>
		<TextInput
			id="managerName"
			label="Reviewer (manager / HR contact)"
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

	<Field label="Originating response reference" inputId="responseReference">
		<TextInput
			id="responseReference"
			label="Originating response reference"
			placeholder="e.g. RES-2026-0044"
			bind:value={d.responseReference}
		/>
	</Field>

	<Field label="Review status" inputId="reviewStatus" required>
		<Select id="reviewStatus" label="Review status" bind:value={d.reviewStatus} required>
			<option value="">Select…</option>
			<option value="draft">Draft</option>
			<option value="completed">Completed</option>
			<option value="changes-agreed">Changes agreed</option>
			<option value="escalated">Escalated</option>
			<option value="cancelled">Cancelled</option>
		</Select>
	</Field>

	<Field label="Review method" inputId="reviewMethod">
		<Select id="reviewMethod" label="Review method" bind:value={d.reviewMethod}>
			<option value="">Select…</option>
			<option value="meeting">Meeting</option>
			<option value="occupational-health-review">Occupational-health review</option>
			<option value="email">Email</option>
			<option value="hr-review">HR review</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Review date" inputId="reviewDate" description="Date the review took place.">
		<DateInput id="reviewDate" label="Review date" bind:value={d.reviewDate} />
	</Field>

	<Field
		label="Next review date"
		inputId="nextReviewDate"
		description="ACAS advises reviewing adjustments regularly — set the next review date."
	>
		<DateInput id="nextReviewDate" label="Next review date" bind:value={d.nextReviewDate} />
	</Field>
</Fieldset>
