<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const p = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Patient demographics.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="First name" inputId="firstName" required>
			<TextInput id="firstName" label="First name" bind:value={p.firstName} required />
		</Field>
		<Field label="Last name" inputId="lastName" required>
			<TextInput id="lastName" label="Last name" bind:value={p.lastName} required />
		</Field>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Date of birth" inputId="dateOfBirth">
			<DateInput id="dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
		</Field>
		<Field label="NHS number" inputId="nhsNumber">
			<TextInput id="nhsNumber" label="NHS number" placeholder="NNN NNN NNNN" bind:value={p.nhsNumber} />
		</Field>
	</div>
</Fieldset>
