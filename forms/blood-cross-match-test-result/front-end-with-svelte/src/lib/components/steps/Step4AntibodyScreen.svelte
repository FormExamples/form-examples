<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Antibody Screen">
	<p class="hint">The antibody screen result and any red-cell alloantibodies identified.</p>

	<Field label="Antibody screen result" inputId="antibodyScreenResult">
		<Select id="antibodyScreenResult" label="Antibody screen result" bind:value={d.antibodyScreenResult}>
			<option value="">Select…</option>
			<option value="negative">Negative</option>
			<option value="positive">Positive</option>
		</Select>
	</Field>

	<Field
		label="Antibodies identified"
		inputId="antibodiesIdentified"
		description="Specificity of any alloantibodies and the antigen-negative requirements arising."
	>
		<TextAreaInput
			id="antibodiesIdentified"
			label="Antibodies identified"
			rows={3}
			placeholder="e.g. Anti-K identified; K-negative units required…"
			bind:value={d.antibodiesIdentified}
		/>
	</Field>

	{#if d.antibodyScreenResult === 'positive'}
		<Alert type="warning" heading="Clinically-significant antibodies">
			<p>
				A positive antibody screen requires antigen-negative unit selection and escalates the
				follow-up urgency. Record the antibody specificity above.
			</p>
		</Alert>
	{/if}
</Fieldset>
