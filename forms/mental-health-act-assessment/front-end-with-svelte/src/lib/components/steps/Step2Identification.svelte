<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 9 — Person identification">
	<p class="hint">Who the assessment is about.</p>

	<Field
		label="Person identifier (NHS number or local ID)"
		required
		inputId="identification-personIdentifier"
	>
		<TextInput
			id="identification-personIdentifier"
			label="Person identifier (NHS number or local ID)"
			required
			placeholder="e.g. 943 476 5919"
			bind:value={i.personIdentifier}
		/>
	</Field>

	<Field label="Age band" inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" bind:value={i.ageBand}>
			<option value="">— Select —</option>
			<option value="child">Child</option>
			<option value="adolescent">Adolescent</option>
			<option value="adult">Adult</option>
			<option value="older-adult">Older adult</option>
		</Select>
	</Field>

	<Field label="Sex" inputId="identification-sex">
		<Select id="identification-sex" label="Sex" bind:value={i.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field
		label="First language"
		description="Record interpreter need if not English."
		inputId="identification-firstLanguage"
	>
		<TextInput
			id="identification-firstLanguage"
			label="First language"
			placeholder="e.g. English; interpreter required"
			bind:value={i.firstLanguage}
		/>
	</Field>
</Fieldset>
