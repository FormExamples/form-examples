<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 7 — Patient identification">
	<p class="hint">Local identifier, age band, sex, and weight for weight-based dosing.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. NHS number or local MRN"
			required
			bind:value={i.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" required inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" required bind:value={i.ageBand}>
			<option value="">— Select —</option>
			<option value="adult">Adult</option>
			<option value="paediatric">Paediatric</option>
		</Select>
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
		label="Weight (kg)"
		description="Optional; supports weight-based dosing."
		inputId="identification-weightKg"
	>
		<NumberInput
			id="identification-weightKg"
			label="Weight in kilograms"
			min={0}
			max={400}
			step={0.1}
			bind:value={i.weightKg}
		/>
	</Field>
</Fieldset>
