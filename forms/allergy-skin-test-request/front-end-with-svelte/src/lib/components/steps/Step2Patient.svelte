<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const p = request.data.patient;
</script>

<Fieldset legend="Patient identification">
	<p class="hint">Patient demographics and access needs.</p>

	<div class="field-grid">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={p.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={p.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" inputId="dateOfBirth">
			<DateInput id="dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
		</Field>
		<Field label="NHS number" inputId="nhsNumber">
			<TextInput id="nhsNumber" label="NHS number" placeholder="NNN NNN NNNN" bind:value={p.nhsNumber} />
		</Field>
	</div>

	<label class="bool-field">
		<CheckboxInput label="Interpreter required" bind:checked={p.interpreterRequired} />
		<span>Interpreter required</span>
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
	.bool-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
</style>
