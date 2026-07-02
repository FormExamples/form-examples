<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 7 — Participant identification">
	<p class="hint">Local identifier, NHS number, age, and sex of the screening participant.</p>

	<Field label="Participant identifier" required inputId="identification-participantIdentifier">
		<TextInput
			id="identification-participantIdentifier"
			label="Participant identifier"
			placeholder="e.g. BCSP-100482"
			required
			bind:value={p.participantIdentifier}
		/>
	</Field>

	<Field label="NHS number" inputId="identification-nhsNumber">
		<TextInput
			id="identification-nhsNumber"
			label="NHS number"
			placeholder="e.g. 943 476 5919"
			bind:value={p.nhsNumber}
		/>
	</Field>

	<Field
		label="Participant age (years)"
		description="The programme invites adults across a defined age range."
		inputId="identification-participantAge"
	>
		<NumberInput
			id="identification-participantAge"
			label="Participant age"
			min={0}
			max={120}
			step={1}
			bind:value={p.participantAge}
		/>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
