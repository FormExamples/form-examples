<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.child;
</script>

<Fieldset legend="Step 2 of 9 — Child details">
	<p class="hint">Who the referral is about, so the child can be identified across services.</p>

	<Field label="Child’s name" required inputId="child-childName">
		<TextInput
			id="child-childName"
			label="Child’s name"
			placeholder="e.g. Jamie Clarke"
			required
			bind:value={c.childName}
		/>
	</Field>

	<Field
		label="Date of birth"
		description="Provide a date of birth OR an age below."
		inputId="child-childDateOfBirth"
	>
		<DateInput id="child-childDateOfBirth" label="Date of birth" bind:value={c.childDateOfBirth} />
	</Field>

	<Field
		label="Age (years)"
		description="Used only when the date of birth is unknown."
		inputId="child-childAge"
	>
		<NumberInput
			id="child-childAge"
			label="Age (years)"
			min={0}
			max={17}
			step={1}
			bind:value={c.childAge}
		/>
	</Field>

	<Field label="Sex" inputId="child-childSex">
		<Select id="child-childSex" label="Sex" bind:value={c.childSex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="other">Other</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Home address" inputId="child-childAddress">
		<TextAreaInput
			id="child-childAddress"
			label="Home address"
			rows={2}
			placeholder="Where the child normally lives"
			bind:value={c.childAddress}
		/>
	</Field>

	<Field label="School / nursery / college" inputId="child-childSetting">
		<TextInput
			id="child-childSetting"
			label="School / nursery / college"
			placeholder="Education or care setting"
			bind:value={c.childSetting}
		/>
	</Field>

	<Field label="NHS number or local reference" inputId="child-childReference">
		<TextInput
			id="child-childReference"
			label="NHS number or local reference"
			placeholder="e.g. 943 476 5919"
			bind:value={c.childReference}
		/>
	</Field>

	<Field label="Ethnicity" inputId="child-childEthnicity">
		<TextInput
			id="child-childEthnicity"
			label="Ethnicity"
			placeholder="Self-described where known"
			bind:value={c.childEthnicity}
		/>
	</Field>

	<Field
		label="First language"
		description="Records any interpreter need."
		inputId="child-childFirstLanguage"
	>
		<TextInput
			id="child-childFirstLanguage"
			label="First language"
			placeholder="e.g. English"
			bind:value={c.childFirstLanguage}
		/>
	</Field>

	<Field label="Disability or communication need" inputId="child-childDisability">
		<TextAreaInput
			id="child-childDisability"
			label="Disability or communication need"
			rows={2}
			placeholder="Any disability or communication need"
			bind:value={c.childDisability}
		/>
	</Field>
</Fieldset>
