<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.personal;
</script>

<Fieldset legend="Step 1 of 9 — Personal details">
	<p class="hint">Who the plan is about, so it can be recognised across care settings.</p>

	<Field label="Name of the person" required inputId="personal-personName">
		<TextInput
			id="personal-personName"
			label="Name of the person"
			placeholder="e.g. Margaret Ellis"
			required
			bind:value={p.personName}
		/>
	</Field>

	<Field label="Date of birth" required inputId="personal-dateOfBirth">
		<DateInput id="personal-dateOfBirth" label="Date of birth" required bind:value={p.dateOfBirth} />
	</Field>

	<Field
		label="Identifier (NHS / CHI number or local ID)"
		required
		inputId="personal-identifier"
	>
		<TextInput
			id="personal-identifier"
			label="Identifier"
			placeholder="e.g. 943 476 5919"
			required
			bind:value={p.identifier}
		/>
	</Field>

	<Field label="Usual address" inputId="personal-address">
		<TextAreaInput
			id="personal-address"
			label="Usual address"
			rows={2}
			placeholder="Usual residence"
			bind:value={p.address}
		/>
	</Field>

	<Field label="Key contact / next of kin" inputId="personal-keyContact">
		<TextAreaInput
			id="personal-keyContact"
			label="Key contact / next of kin"
			rows={2}
			placeholder="Name, relationship, and contact details"
			bind:value={p.keyContact}
		/>
	</Field>
</Fieldset>
