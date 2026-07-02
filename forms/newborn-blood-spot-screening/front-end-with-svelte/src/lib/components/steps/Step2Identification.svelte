<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const b = assessment.data.babyId;
</script>

<Fieldset legend="Step 2 of 7 — Baby identification">
	<p class="hint">The baby's identity and gestation. Date of birth is day 0 for the sample-age calculation.</p>

	<Field label="NHS number" required inputId="babyId-nhsNumber">
		<TextInput
			id="babyId-nhsNumber"
			label="NHS number"
			placeholder="e.g. 943 476 5919"
			required
			bind:value={b.nhsNumber}
		/>
	</Field>

	<Field label="Baby name" inputId="babyId-babyName">
		<TextInput
			id="babyId-babyName"
			label="Baby name"
			placeholder="Name may be provisional"
			bind:value={b.babyName}
		/>
	</Field>

	<Field label="Date of birth" required inputId="babyId-dateOfBirth">
		<DateInput id="babyId-dateOfBirth" label="Date of birth" required bind:value={b.dateOfBirth} />
	</Field>

	<Field label="Time of birth" inputId="babyId-timeOfBirth">
		<TextInput
			id="babyId-timeOfBirth"
			label="Time of birth"
			type="time"
			bind:value={b.timeOfBirth}
		/>
	</Field>

	<Field label="Sex" required inputId="babyId-sex">
		<Select id="babyId-sex" label="Sex" required bind:value={b.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="indeterminate">Indeterminate</option>
			<option value="not-recorded">Not recorded</option>
		</Select>
	</Field>

	<Field label="Gestation at birth (weeks)" inputId="babyId-gestationWeeks">
		<NumberInput
			id="babyId-gestationWeeks"
			label="Gestation at birth (weeks)"
			min={22}
			max={45}
			step={1}
			bind:value={b.gestationWeeks}
		/>
	</Field>
</Fieldset>
