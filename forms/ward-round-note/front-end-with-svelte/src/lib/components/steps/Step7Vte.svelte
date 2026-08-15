<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const v = assessment.data.vte;
</script>

<Fieldset legend="Step 7 of 11 — VTE assessment">
	<p class="hint">Venous thromboembolism assessment status. Required component.</p>

	<Field
		label="VTE assessment status"
		description='"Not done" raises a high-priority safety flag (NICE NG89).'
		inputId="vte-vteStatus"
	>
		<Select id="vte-vteStatus" label="VTE assessment status" bind:value={v.vteStatus}>
			<option value="">— Select —</option>
			<option value="assessed">Assessed</option>
			<option value="not-required">Not required</option>
			<option value="not-done">Not done</option>
		</Select>
	</Field>

	<Field label="VTE prophylaxis in place?" inputId="vte-vteProphylaxisInPlace">
		<Select id="vte-vteProphylaxisInPlace" label="VTE prophylaxis in place?" bind:value={v.vteProphylaxisInPlace}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
