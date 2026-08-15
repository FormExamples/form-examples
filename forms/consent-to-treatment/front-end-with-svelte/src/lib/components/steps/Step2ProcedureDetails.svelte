<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.procedureDetails;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Procedure Details">
	<p class="hint">Information about the planned procedure.</p>

	<Field label="Procedure Name" required inputId="procedureName">
		<TextInput id="procedureName" label="Procedure Name" required bind:value={p.procedureName} />
	</Field>

	<Field label="Procedure Description" inputId="procedureDescription">
		<TextAreaInput
			id="procedureDescription"
			label="Procedure Description"
			rows={4}
			placeholder="Describe the procedure in terms the patient can understand..."
			bind:value={p.procedureDescription}
		/>
	</Field>

	<div class="field-grid">
		<Field label="Treating Clinician" required inputId="treatingClinician">
			<TextInput
				id="treatingClinician"
				label="Treating Clinician"
				required
				bind:value={p.treatingClinician}
			/>
		</Field>
		<Field label="Department" required inputId="department">
			<TextInput id="department" label="Department" required bind:value={p.department} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Scheduled Date" required inputId="scheduledDate">
			<DateInput id="scheduledDate" label="Scheduled Date" required bind:value={p.scheduledDate} />
		</Field>
		<Field label="Estimated Duration" inputId="estimatedDuration">
			<TextInput
				id="estimatedDuration"
				label="Estimated Duration"
				placeholder="e.g., 1-2 hours"
				bind:value={p.estimatedDuration}
			/>
		</Field>
	</div>

	<Field label="Admission Required" required>
		<RadioGroup label="Admission Required">
			{#each yesNoOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="admissionRequired"
						value={opt.value}
						bind:group={p.admissionRequired}
						required
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
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
