<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 8 — Patient identification">
	<p class="hint">
		Local identifier, age band, and sex. MELD applies to adults (&ge; 16 years); the female
		indicator is used by the MELD 3.0 instrument.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. HEP-100482 or hospital MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" required inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" required bind:value={p.ageBand}>
			<option value="">— Select —</option>
			<option value="16-39">16-39</option>
			<option value="40-59">40-59</option>
			<option value="60-74">60-74</option>
			<option value="75-plus">75 and over</option>
		</Select>
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
