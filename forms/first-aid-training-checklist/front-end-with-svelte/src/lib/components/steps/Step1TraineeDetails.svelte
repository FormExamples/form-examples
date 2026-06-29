<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.traineeDetails;
</script>

<Fieldset legend="Trainee Details">
	<p class="hint">Who is being assessed, by whom, and when.</p>

	<div class="field-grid">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Trainee ID" inputId="traineeId" description="e.g. FAW-2026-0017">
			<TextInput id="traineeId" label="Trainee ID" bind:value={d.traineeId} />
		</Field>
		<Field label="Workplace role" inputId="role">
			<Select id="role" label="Workplace role" bind:value={d.role}>
				<option value="">-- Select --</option>
				<option value="first-aider">First Aider</option>
				<option value="workplace-first-aider">Workplace First Aider</option>
				<option value="instructor-candidate">Instructor Candidate</option>
				<option value="security-officer">Security Officer</option>
				<option value="lifeguard">Lifeguard</option>
				<option value="teacher">Teacher</option>
				<option value="volunteer">Volunteer</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Session date" required inputId="sessionDate">
			<DateInput id="sessionDate" label="Session date" required bind:value={d.sessionDate} />
		</Field>
		<Field
			label="Prior certification expiry"
			inputId="priorCertificationExpiry"
			description="Leave blank if first certification"
		>
			<DateInput
				id="priorCertificationExpiry"
				label="Prior certification expiry"
				bind:value={d.priorCertificationExpiry}
			/>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Examiner name" required inputId="examinerName">
			<TextInput id="examinerName" label="Examiner name" required bind:value={d.examinerName} />
		</Field>
		<Field label="Venue / training centre" inputId="venue">
			<TextInput id="venue" label="Venue / training centre" bind:value={d.venue} />
		</Field>
	</div>
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
