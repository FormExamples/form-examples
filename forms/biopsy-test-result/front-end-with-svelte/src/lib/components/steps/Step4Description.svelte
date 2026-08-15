<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Description">
	<p class="hint">The macroscopic (gross) and microscopic (histological) descriptions.</p>

	<Field label="Macroscopic description" inputId="macroscopicDescription">
		<TextAreaInput
			id="macroscopicDescription"
			label="Macroscopic description"
			rows={4}
			placeholder="Macroscopic (gross) description of the specimen as received…"
			bind:value={d.macroscopicDescription}
		/>
	</Field>

	<Field label="Microscopic description" inputId="microscopicDescription">
		<TextAreaInput
			id="microscopicDescription"
			label="Microscopic description"
			rows={5}
			placeholder="Microscopic (histological) description of the specimen…"
			bind:value={d.microscopicDescription}
		/>
	</Field>
</Fieldset>
