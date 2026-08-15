<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 6 — Patient identification">
	<p class="hint">Local identifier, age band, and sex. Wells is for adults (&ge; 18 years) with suspected PE.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. ED-100482 or hospital MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" required inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" required bind:value={p.ageBand}>
			<option value="">— Select —</option>
			<option value="18-39">18-39</option>
			<option value="40-64">40-64</option>
			<option value="65-74">65-74</option>
			<option value="75-84">75-84</option>
			<option value="85-plus">85 and over</option>
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
