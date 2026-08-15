<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 7 — Patient identification">
	<p class="hint">
		Local identifier, sex, and the side of the injured knee. The Ottawa Knee Rule is validated for
		adults with acute knee trauma.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. ED-204817 or hospital MRN"
			required
			bind:value={p.patientIdentifier}
		/>
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

	<Field label="Injured side" inputId="identification-injuredSide">
		<Select id="identification-injuredSide" label="Injured side" bind:value={p.injuredSide}>
			<option value="">— Select —</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
		</Select>
	</Field>
</Fieldset>
