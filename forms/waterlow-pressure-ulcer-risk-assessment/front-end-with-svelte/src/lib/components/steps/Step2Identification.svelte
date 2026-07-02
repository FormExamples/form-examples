<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 5 — Patient identification">
	<p class="hint">
		Local identifier, age band, and sex. Age band and sex both contribute to the score.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. ACU-100482 or hospital MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age band"
		description="14-49 = 1 point, 50-64 = 2, 65-74 = 3, 75-80 = 4, 81 and over = 5."
		required
		inputId="identification-ageBand"
	>
		<Select id="identification-ageBand" label="Age band" required bind:value={p.ageBand}>
			<option value="">— Select —</option>
			<option value="14-49">14-49 (1 point)</option>
			<option value="50-64">50-64 (2 points)</option>
			<option value="65-74">65-74 (3 points)</option>
			<option value="75-80">75-80 (4 points)</option>
			<option value="81-plus">81 and over (5 points)</option>
		</Select>
	</Field>

	<Field
		label="Sex"
		description="Male = 1 point, female = 2 points."
		required
		inputId="identification-sex"
	>
		<Select id="identification-sex" label="Sex" required bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="male">Male (1 point)</option>
			<option value="female">Female (2 points)</option>
		</Select>
	</Field>
</Fieldset>
