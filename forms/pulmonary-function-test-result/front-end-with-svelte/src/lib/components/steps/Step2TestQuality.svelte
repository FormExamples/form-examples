<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Test Quality">
	<p class="hint">The ATS/ERS acceptability and repeatability grade, plus the clinical history.</p>

	<Field
		label="Test quality (ATS/ERS)"
		inputId="testQuality"
		description="Acceptability and repeatability of the manoeuvres."
	>
		<Select id="testQuality" label="Test quality" bind:value={d.testQuality}>
			<option value="">Select…</option>
			<option value="acceptable">Acceptable</option>
			<option value="sub-optimal">Sub-optimal</option>
			<option value="unacceptable">Unacceptable</option>
		</Select>
	</Field>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={3}
			placeholder="Clinical history and the question the test was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>
</Fieldset>
