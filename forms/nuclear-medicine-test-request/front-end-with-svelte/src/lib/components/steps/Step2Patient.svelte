<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const d = request.data.patient;
</script>

<Fieldset legend="Patient identification">
	<p class="hint">Patient demographics and weight (used for administered-activity calculation).</p>

	<div class="field-grid">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" inputId="dob">
			<DateInput id="dob" label="Date of birth" bind:value={d.dateOfBirth} />
		</Field>
		<Field label="NHS number" inputId="nhsNumber">
			<TextInput id="nhsNumber" label="NHS number" placeholder="NNN NNN NNNN" bind:value={d.nhsNumber} />
		</Field>
	</div>

	<Field label="Weight (kg)" inputId="weightKg">
		<NumberInput id="weightKg" label="Weight" min={0} max={500} step={0.1} bind:value={d.weightKg} />
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
