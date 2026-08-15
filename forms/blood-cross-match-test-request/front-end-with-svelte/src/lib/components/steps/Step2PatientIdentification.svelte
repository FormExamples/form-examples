<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';

	const d = assessment.data.patient;
</script>

<Fieldset legend="Step 2 of 7 · Patient identification">
	<p class="hint">Patient demographics and positive patient identification.</p>

	<div class="field-grid">
		<Field label="First name" required inputId="patient-firstName">
			<TextInput id="patient-firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="patient-lastName">
			<TextInput id="patient-lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" inputId="patient-dateOfBirth">
			<DateInput id="patient-dateOfBirth" label="Date of birth" bind:value={d.dateOfBirth} />
		</Field>
		<Field label="NHS number" inputId="patient-nhsNumber">
			<TextInput id="patient-nhsNumber" label="NHS number" placeholder="NNN NNN NNNN" bind:value={d.nhsNumber} />
		</Field>
	</div>

	<h3 class="subhead">Identity safety</h3>
	<label class="bool-field">
		<CheckboxInput
			id="patient-positivePatientIdConfirmed"
			label="Positive patient identification confirmed at the bedside"
			bind:checked={d.positivePatientIdConfirmed}
		/>
		<span>Positive patient identification confirmed at the bedside</span>
	</label>
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
	.subhead {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
	.bool-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
