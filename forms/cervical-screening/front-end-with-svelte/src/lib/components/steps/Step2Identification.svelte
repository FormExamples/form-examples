<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 9 — Patient identification">
	<p class="hint">Local identifier, NHS number, age, and date of birth. Age drives eligibility.</p>

	<Field label="Local patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Local patient identifier"
			placeholder="e.g. GP-448120"
			required
			bind:value={i.patientIdentifier}
		/>
	</Field>

	<Field label="NHS number" inputId="identification-nhsNumber">
		<TextInput
			id="identification-nhsNumber"
			label="NHS number"
			placeholder="e.g. 943 476 5919"
			bind:value={i.nhsNumber}
		/>
	</Field>

	<Field
		label="Age (years)"
		description="Routine screening applies to ages 25-64. An age outside the range ceases the screen."
		inputId="identification-age"
	>
		<NumberInput
			id="identification-age"
			label="Age (years)"
			min={0}
			max={120}
			step={1}
			bind:value={i.age}
		/>
	</Field>

	<Field label="Date of birth" inputId="identification-dateOfBirth">
		<TextInput
			id="identification-dateOfBirth"
			label="Date of birth"
			type="date"
			class="date-input"
			bind:value={i.dateOfBirth}
		/>
	</Field>
</Fieldset>
