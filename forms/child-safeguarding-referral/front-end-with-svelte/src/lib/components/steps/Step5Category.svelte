<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.category;
</script>

<Fieldset legend="Step 5 of 9 — Category of abuse">
	<p class="hint">The primary category, any additional categories, and the presenting evidence.</p>

	<Field
		label="Primary category of abuse"
		description="Select the category that best fits the main concern."
		required
		inputId="category-primaryCategory"
	>
		<Select
			id="category-primaryCategory"
			label="Primary category of abuse"
			required
			bind:value={c.primaryCategory}
		>
			<option value="">— Select —</option>
			<option value="physical">Physical abuse</option>
			<option value="emotional">Emotional abuse</option>
			<option value="sexual">Sexual abuse</option>
			<option value="neglect">Neglect</option>
		</Select>
	</Field>

	<Field
		label="Additional categories"
		description="Any further categories, e.g. sexual, neglect."
		inputId="category-additionalCategories"
	>
		<TextInput
			id="category-additionalCategories"
			label="Additional categories"
			placeholder="Comma-separated, if more than one"
			bind:value={c.additionalCategories}
		/>
	</Field>

	<Field label="Indicators and presenting evidence" inputId="category-presentingEvidence">
		<TextAreaInput
			id="category-presentingEvidence"
			label="Indicators and presenting evidence"
			rows={3}
			placeholder="The indicators and evidence for the category (or categories)."
			bind:value={c.presentingEvidence}
		/>
	</Field>
</Fieldset>
