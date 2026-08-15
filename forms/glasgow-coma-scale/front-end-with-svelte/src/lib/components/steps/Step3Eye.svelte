<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { eyeOptions, scoreFor } from '#lib/engine/gcs-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const e = assessment.data.eye;
	const score = $derived(scoreFor(eyeOptions, e.eyeResponse));
	const isNt = $derived(e.eyeResponse === 'NT');
</script>

<Fieldset legend="Step 3 of 8 — Eye opening (E)">
	<p class="hint">Best eye-opening response (E, 1-4), or NT when it cannot be tested.</p>

	<Field label="Eye opening response" inputId="eye-eyeResponse">
		<Select id="eye-eyeResponse" label="Eye opening response" bind:value={e.eyeResponse}>
			<option value="">— Select —</option>
			{#each eyeOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	{#if isNt}
		<Field label="Reason not testable" inputId="eye-eyeNotTestableReason">
			<TextInput
				id="eye-eyeNotTestableReason"
				label="Reason not testable"
				placeholder="e.g. periorbital swelling, dressings"
				bind:value={e.eyeNotTestableReason}
			/>
		</Field>
	{/if}

	<Field label="Eye score">
		<strong class="text-base-content">{isNt ? 'NT' : score !== null ? score : '—'}</strong>
	</Field>
</Fieldset>
