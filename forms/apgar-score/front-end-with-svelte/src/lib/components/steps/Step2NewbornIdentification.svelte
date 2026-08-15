<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 4 — Newborn identification">
	<p class="hint">Local identifier, sex, and — for multiple births — birth order.</p>

	<Field label="Newborn identifier" required inputId="identification-newbornIdentifier">
		<TextInput
			id="identification-newbornIdentifier"
			label="Newborn identifier"
			placeholder="e.g. NB-100482 or cot label"
			required
			bind:value={i.newbornIdentifier}
		/>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={i.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field
		label="Birth order"
		description="Position for multiple births (1 for a singleton)."
		inputId="identification-birthOrder"
	>
		<NumberInput
			id="identification-birthOrder"
			label="Birth order"
			min={1}
			max={10}
			step={1}
			bind:value={i.birthOrder}
		/>
	</Field>
</Fieldset>
