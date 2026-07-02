<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 3 of 8 — Patient identification">
	<p class="hint">A minimal identifier plus the age band and sex used to interpret findings.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. ED-2026-0001 or NHS number"
			required
			bind:value={i.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" bind:value={i.ageBand}>
			<option value="">— Select —</option>
			<option value="paediatric">Paediatric</option>
			<option value="adult">Adult</option>
			<option value="older-adult">Older adult</option>
		</Select>
	</Field>

	<Field label="Sex" inputId="identification-sex">
		<Select id="identification-sex" label="Sex" bind:value={i.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
