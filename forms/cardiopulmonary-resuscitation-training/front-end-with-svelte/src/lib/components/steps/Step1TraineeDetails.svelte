<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.traineeDetails;
</script>

<Fieldset legend="Trainee Details">
	<p class="hint">Identify the trainee, their role, and the verification session.</p>

	<div class="field-grid">
		<Field label="First name" inputId="firstName">
			<TextInput id="firstName" label="First name" bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Trainee ID" inputId="traineeId">
			<TextInput id="traineeId" label="Trainee ID" bind:value={d.traineeId} />
		</Field>
		<Field label="Role" inputId="role">
			<Select id="role" label="Role" bind:value={d.role}>
				<option value="">-- Select --</option>
				<option value="instructor">Instructor</option>
				<option value="first-responder">First responder</option>
				<option value="nurse">Nurse</option>
				<option value="paramedic">Paramedic</option>
				<option value="physician">Physician</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Session date" required inputId="sessionDate">
			<DateInput id="sessionDate" label="Session date" required bind:value={d.sessionDate} />
		</Field>
		<Field label="Prior certification expiry" description="Leave blank if none" inputId="priorCertificationExpiry">
			<DateInput id="priorCertificationExpiry" label="Prior certification expiry" bind:value={d.priorCertificationExpiry} />
		</Field>
	</div>

	<Field label="Examiner name" inputId="examinerName">
		<TextInput id="examinerName" label="Examiner name" bind:value={d.examinerName} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
