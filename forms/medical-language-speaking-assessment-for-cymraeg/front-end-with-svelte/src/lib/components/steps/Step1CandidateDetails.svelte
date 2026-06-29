<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.candidate;

	const yearsOptions = [
		{ value: '0-2', label: '0 - 2 years' },
		{ value: '3-5', label: '3 - 5 years' },
		{ value: '6-10', label: '6 - 10 years' },
		{ value: '11+', label: '11 or more years' }
	];
</script>

<Fieldset legend="Manylion yr ymgeisydd / Candidate details">
	<p class="hint">Identifying details for the candidate, examiner, and test occasion.</p>

	<div class="field-grid">
		<Field label="Candidate ID" required inputId="candidateId">
			<TextInput
				id="candidateId"
				label="Candidate ID"
				required
				placeholder="e.g. CYM-2026-00123"
				bind:value={d.candidateId}
			/>
		</Field>
		<Field label="Enw'r ymgeisydd / Candidate name" required inputId="candidateName">
			<TextInput id="candidateName" label="Candidate name" required bind:value={d.candidateName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Examiner name" required inputId="examinerName">
			<TextInput id="examinerName" label="Examiner name" required bind:value={d.examinerName} />
		</Field>
		<Field label="Test centre" inputId="testCentre">
			<TextInput
				id="testCentre"
				label="Test centre"
				placeholder="e.g. Caerdydd / Bangor / Aberystwyth"
				bind:value={d.testCentre}
			/>
		</Field>
	</div>

	<Field label="Test date" required inputId="testDate">
		<DateInput id="testDate" label="Test date" required bind:value={d.testDate} />
	</Field>

	<div class="field-grid">
		<Field label="Candidate first language" inputId="firstLanguage">
			<TextInput
				id="firstLanguage"
				label="Candidate first language"
				placeholder="e.g. English, Cymraeg, Polish"
				bind:value={d.firstLanguage}
			/>
		</Field>
		<Field label="Country where the candidate trained" inputId="countryOfTraining">
			<TextInput
				id="countryOfTraining"
				label="Country of training"
				placeholder="e.g. Wales, England, Ireland"
				bind:value={d.countryOfTraining}
			/>
		</Field>
	</div>

	<Field label="Years of clinical experience" inputId="yearsOfExperience">
		<Select id="yearsOfExperience" label="Years of clinical experience" bind:value={d.yearsOfExperience}>
			<option value="">Select…</option>
			{#each yearsOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
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
