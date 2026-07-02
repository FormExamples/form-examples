<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const l = assessment.data.lifestyle;
</script>

<Fieldset legend="Step 4 of 8 — Lifestyle">
	<p class="hint">Smoking status and body mass index.</p>

	<Field label="Smoking status" inputId="lifestyle-smokingStatus">
		<Select id="lifestyle-smokingStatus" label="Smoking status" bind:value={l.smokingStatus}>
			<option value="">— Select —</option>
			<option value="non">Non-smoker</option>
			<option value="ex">Ex-smoker</option>
			<option value="light">Light smoker (&lt; 10/day)</option>
			<option value="moderate">Moderate smoker (10-19/day)</option>
			<option value="heavy">Heavy smoker (&ge; 20/day)</option>
		</Select>
	</Field>

	<Field
		label="Body mass index (kg/m²)"
		description="Required input for the risk calculation."
		inputId="lifestyle-bodyMassIndex"
	>
		<NumberInput
			id="lifestyle-bodyMassIndex"
			label="Body mass index (kg/m²)"
			min={15}
			max={60}
			step={0.1}
			bind:value={l.bodyMassIndex}
		/>
	</Field>
</Fieldset>
