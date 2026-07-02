<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const s = assessment.data.safety;
</script>

<Fieldset legend="Step 8 of 11 — Safety">
	<p class="hint">DVLA driving eligibility and status, and bathing safety advice.</p>

	<Field label="DVLA driving eligibility" inputId="safety-dvlaEligible">
		<Select id="safety-dvlaEligible" label="DVLA driving eligibility" bind:value={s.dvlaEligible}>
			<option value="">— Select —</option>
			<option value="eligible">Eligible</option>
			<option value="not-eligible">Not eligible</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field
		label="Currently driving"
		description="Driving while not DVLA-eligible raises a driving-safety flag."
		inputId="safety-currentlyDriving"
	>
		<Select id="safety-currentlyDriving" label="Currently driving" bind:value={s.currentlyDriving}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Bathing / showering advice given" inputId="safety-bathingAdviceGiven">
		<Select
			id="safety-bathingAdviceGiven"
			label="Bathing / showering advice given"
			bind:value={s.bathingAdviceGiven}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
