<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.background;
</script>

<Fieldset legend="5. Background">
	<p class="hint">Smoking status and current inhalers / respiratory medication.</p>

	<Field label="Smoking status" inputId="smokingStatus">
		<Select label="Smoking status" id="smokingStatus" bind:value={d.smokingStatus}>
			<option value="">— Select —</option>
			<option value="never">Never</option>
			<option value="ex">Ex-smoker</option>
			<option value="current">Current</option>
		</Select>
	</Field>

	<Field
		label="Current inhalers / respiratory medication"
		inputId="currentInhalers"
		description="Relevant to withhold instructions before reversibility testing."
	>
		<TextAreaInput
			id="currentInhalers"
			label="Current inhalers / respiratory medication"
			rows={2}
			bind:value={d.currentInhalers}
		/>
	</Field>
</Fieldset>
