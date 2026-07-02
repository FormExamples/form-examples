<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 8 — Patient identification">
	<p class="hint">
		Identify the patient. MEWS is validated for acutely ill adults (16 years and over).
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. WD-100482"
			required
			bind:value={d.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" bind:value={d.ageBand}>
			<option value="">— Select —</option>
			<option value="16-39">16-39</option>
			<option value="40-59">40-59</option>
			<option value="60-74">60-74</option>
			<option value="75-plus">75 and over</option>
		</Select>
	</Field>

	<Field label="Sex" inputId="identification-sex">
		<Select id="identification-sex" label="Sex" bind:value={d.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
