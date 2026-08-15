<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Examination">
	<p class="hint">The macroscopic and microscopic descriptions and the histopathological diagnosis.</p>

	<Field label="Macroscopic description" inputId="macroscopicDescription">
		<TextAreaInput
			id="macroscopicDescription"
			label="Macroscopic description"
			rows={4}
			placeholder="Gross description: dimensions, appearance, blocks taken…"
			bind:value={d.macroscopicDescription}
		/>
	</Field>

	<Field label="Microscopic description" inputId="microscopicDescription">
		<TextAreaInput
			id="microscopicDescription"
			label="Microscopic description"
			rows={5}
			placeholder="Histological description of the tissue under the microscope…"
			bind:value={d.microscopicDescription}
		/>
	</Field>

	<Field label="Diagnosis" inputId="diagnosis" required>
		<TextAreaInput
			id="diagnosis"
			label="Diagnosis"
			rows={3}
			placeholder="Histopathological diagnosis (the body of the report conclusion)…"
			bind:value={d.diagnosis}
		/>
	</Field>
</Fieldset>
