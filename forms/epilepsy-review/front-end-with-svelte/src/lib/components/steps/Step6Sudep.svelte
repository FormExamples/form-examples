<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const s = assessment.data.sudep;
</script>

<Fieldset legend="Step 6 of 11 — SUDEP risk discussion">
	<p class="hint">Sudden Unexpected Death in Epilepsy — discussion and documentation.</p>

	<Field
		label="SUDEP discussed and documented"
		description="Anything other than Yes raises a SUDEP-not-documented flag."
		inputId="sudep-sudepDiscussed"
	>
		<Select id="sudep-sudepDiscussed" label="SUDEP discussed and documented" bind:value={s.sudepDiscussed}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
