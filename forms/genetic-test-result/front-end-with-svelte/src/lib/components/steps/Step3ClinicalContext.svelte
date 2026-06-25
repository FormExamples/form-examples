<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Clinical Context">
	<p class="hint">The clinical question and the relevant inheritance pattern.</p>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={4}
			placeholder="Clinical history, phenotype, and the question the test was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>

	<Field
		label="Inheritance pattern"
		inputId="inheritancePattern"
		description="e.g. autosomal dominant, autosomal recessive, X-linked, mitochondrial."
	>
		<TextInput
			id="inheritancePattern"
			label="Inheritance pattern"
			placeholder="e.g. Autosomal dominant"
			bind:value={d.inheritancePattern}
		/>
	</Field>
</Fieldset>
