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
		Local identifier, age band, sex, and ancestry. The WHO adult bands assume adult physiology
		(&ge; 18 years); ancestry drives the Asian lower-threshold action points.
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

	<Field
		label="Ancestry"
		description="Asian ancestry lowers the cardiometabolic action points to 23 and 27.5 kg/m² (flags only; the WHO category is unchanged)."
		inputId="identification-ancestry"
	>
		<Select id="identification-ancestry" label="Ancestry" bind:value={p.ancestry}>
			<option value="">— Select —</option>
			<option value="asian">Asian ancestry</option>
			<option value="other">Other ancestry</option>
			<option value="unspecified">Unspecified</option>
		</Select>
	</Field>
</Fieldset>
