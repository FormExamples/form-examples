<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.candidateDetails;

	const professionOptions = [
		{ value: 'medicine', label: 'Medicine' },
		{ value: 'nursing', label: 'Nursing' },
		{ value: 'dentistry', label: 'Dentistry' },
		{ value: 'pharmacy', label: 'Pharmacy' },
		{ value: 'physiotherapy', label: 'Physiotherapy' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Candidate details">
	<p class="hint">Identifying details for the candidate and the test sitting.</p>

	<div class="field-grid">
		<Field label="Candidate number" inputId="candidateNumber">
			<TextInput id="candidateNumber" label="Candidate number" bind:value={d.candidateNumber} />
		</Field>
		<Field label="Date of test" required inputId="dateOfTest">
			<DateInput id="dateOfTest" label="Date of test" required bind:value={d.dateOfTest} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<Field label="Profession" required>
		<RadioGroup label="Profession">
			{#each professionOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="profession"
						value={opt.value}
						bind:group={d.profession}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="First language" inputId="firstLanguage">
			<TextInput id="firstLanguage" label="First language" bind:value={d.firstLanguage} />
		</Field>
		<Field label="Test venue" inputId="testVenue">
			<TextInput id="testVenue" label="Test venue" bind:value={d.testVenue} />
		</Field>
		<Field label="Assessor name" inputId="assessorName">
			<TextInput id="assessorName" label="Assessor name" bind:value={d.assessorName} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
