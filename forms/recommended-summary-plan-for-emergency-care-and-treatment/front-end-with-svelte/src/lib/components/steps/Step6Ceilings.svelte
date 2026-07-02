<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const ce = assessment.data.ceilings;
</script>

<Fieldset legend="Step 6 of 9 — Ceilings of treatment">
	<p class="hint">
		Agreed limits on treatment, such as hospital transfer or critical-care admission.
	</p>

	<Field label="Hospital transfer" inputId="ceilings-hospitalTransfer">
		<Select id="ceilings-hospitalTransfer" label="Hospital transfer" bind:value={ce.hospitalTransfer}>
			<option value="">— Select —</option>
			<option value="appropriate">Appropriate</option>
			<option value="not-appropriate">Not appropriate</option>
		</Select>
	</Field>

	<Field label="Critical-care admission" inputId="ceilings-criticalCareAdmission">
		<Select
			id="ceilings-criticalCareAdmission"
			label="Critical-care admission"
			bind:value={ce.criticalCareAdmission}
		>
			<option value="">— Select —</option>
			<option value="appropriate">Appropriate</option>
			<option value="not-appropriate">Not appropriate</option>
		</Select>
	</Field>

	<Field label="Other agreed limits" inputId="ceilings-treatmentCeilings">
		<TextAreaInput
			id="ceilings-treatmentCeilings"
			label="Other agreed limits"
			rows={3}
			placeholder="Any other ceilings of treatment agreed."
			bind:value={ce.treatmentCeilings}
		/>
	</Field>
</Fieldset>
