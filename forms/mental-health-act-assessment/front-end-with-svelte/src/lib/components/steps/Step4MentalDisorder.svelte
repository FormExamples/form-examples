<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.mentalDisorder;
</script>

<Fieldset legend="Step 4 of 9 — Mental disorder (criterion 1)">
	<p class="hint">
		Criterion 1 — a mental disorder of a nature or degree that warrants the proposed action.
	</p>

	<Field
		label="Mental disorder present (criterion 1)"
		inputId="mentalDisorder-mentalDisorderPresent"
	>
		<Select
			id="mentalDisorder-mentalDisorderPresent"
			label="Mental disorder present (criterion 1)"
			bind:value={m.mentalDisorderPresent}
		>
			<option value="">— Select —</option>
			<option value="met">Met</option>
			<option value="not-met">Not met</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Supporting evidence" inputId="mentalDisorder-mentalDisorderEvidence">
		<TextAreaInput
			id="mentalDisorder-mentalDisorderEvidence"
			label="Supporting evidence"
			rows={3}
			placeholder="Presentation, nature / degree of disorder, and supporting evidence."
			bind:value={m.mentalDisorderEvidence}
		/>
	</Field>
</Fieldset>
