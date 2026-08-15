<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.context;
</script>

<Fieldset legend="4. Seizure / Epilepsy Context">
	<p class="hint">Seizure frequency, current antiepileptic drugs, and epilepsy status.</p>

	<Field label="Epilepsy / seizure status">
		<CheckboxGroup label="Epilepsy / seizure status">
			<label><CheckboxInput label="First seizure" bind:checked={d.firstSeizure} /> First seizure</label>
			<label
				><CheckboxInput label="Known epilepsy" bind:checked={d.knownEpilepsy} /> Known epilepsy</label
			>
		</CheckboxGroup>
	</Field>

	<Field label="Seizure frequency" inputId="seizureFrequency">
		<TextInput
			id="seizureFrequency"
			label="Seizure frequency"
			placeholder="e.g. 2–3 per week, single episode, none since…"
			bind:value={d.seizureFrequency}
		/>
	</Field>

	<Field label="Current antiepileptic drugs" inputId="currentAntiepileptics">
		<TextAreaInput
			id="currentAntiepileptics"
			label="Current antiepileptic drugs"
			rows={3}
			placeholder="Current antiepileptic medications and doses…"
			bind:value={d.currentAntiepileptics}
		/>
	</Field>
</Fieldset>
