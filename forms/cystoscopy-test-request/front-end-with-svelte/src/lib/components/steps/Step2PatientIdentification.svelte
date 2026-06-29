<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const p = requestStore.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Who the request is for. Age drives the NICE NG12 two-week-wait thresholds.</p>

	<Field label="NHS number" inputId="nhsNumber" required>
		<TextInput
			id="nhsNumber"
			label="NHS number"
			placeholder="e.g. 485 777 3456"
			bind:value={p.nhsNumber}
			required
		/>
	</Field>

	<Field label="First name" inputId="firstName">
		<TextInput id="firstName" label="First name" placeholder="First name" bind:value={p.firstName} />
	</Field>

	<Field label="Last name" inputId="lastName">
		<TextInput id="lastName" label="Last name" placeholder="Last name" bind:value={p.lastName} />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
	</Field>

	<Field label="Age (years)" inputId="age" description="Used for NICE NG12 two-week-wait age thresholds.">
		<NumberInput id="age" label="Age (years)" min={0} max={120} bind:value={p.age} />
	</Field>
</Fieldset>
