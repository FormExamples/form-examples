<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { ageModifierFor } from '#lib/engine/centor-grader.js';
	import { ageModifierLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
	const modifier = $derived(ageModifierFor(p.ageYears));
</script>

<Fieldset legend="Step 2 of 8 — Patient identification">
	<p class="hint">Local identifier, age, and sex. Age drives the McIsaac modifier.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. GP-100482 or clinic MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age (whole years)"
		description="McIsaac modifier: +1 for ages 3–14, 0 for 15–44, −1 for 45 and over."
		inputId="identification-ageYears"
	>
		<NumberInput
			id="identification-ageYears"
			label="Age in years"
			min={0}
			max={120}
			step={1}
			bind:value={p.ageYears}
		/>
	</Field>

	<Field label="McIsaac age modifier">
		<span class="inline-block rounded-full border border-base-300 bg-base-200 px-3 py-1 text-sm font-bold text-base-content">
			{ageModifierLabel(modifier)}
		</span>
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
