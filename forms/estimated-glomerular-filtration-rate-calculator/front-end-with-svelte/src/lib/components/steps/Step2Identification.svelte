<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 4 — Patient identification">
	<p class="hint">
		Local identifier, age, and sex. Age drives the age-decay term and sex selects the kappa, alpha,
		and female-multiplier constants. The equation assumes adult physiology (&ge; 18 years).
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. GP-100482 or hospital MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age (years)"
		description="Whole years; the CKD-EPI 2021 equation is validated in adults."
		inputId="identification-ageYears"
	>
		<NumberInput
			id="identification-ageYears"
			label="Age in years"
			min={18}
			max={120}
			step={1}
			bind:value={p.ageYears}
		/>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
		</Select>
	</Field>
</Fieldset>
