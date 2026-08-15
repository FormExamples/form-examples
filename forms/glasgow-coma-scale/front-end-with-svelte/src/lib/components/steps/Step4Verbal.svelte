<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { verbalOptions, scoreFor } from '#lib/engine/gcs-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const v = assessment.data.verbal;
	const score = $derived(scoreFor(verbalOptions, v.verbalResponse));
	const isNt = $derived(v.verbalResponse === 'NT');
</script>

<Fieldset legend="Step 4 of 8 — Verbal response (V)">
	<p class="hint">Best verbal response (V, 1-5), or NT when it cannot be tested.</p>

	<Field label="Verbal response" inputId="verbal-verbalResponse">
		<Select id="verbal-verbalResponse" label="Verbal response" bind:value={v.verbalResponse}>
			<option value="">— Select —</option>
			{#each verbalOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	{#if isNt}
		<Field label="Reason not testable" inputId="verbal-verbalNotTestableReason">
			<TextInput
				id="verbal-verbalNotTestableReason"
				label="Reason not testable"
				placeholder="e.g. intubation, tracheostomy, language barrier"
				bind:value={v.verbalNotTestableReason}
			/>
		</Field>
	{/if}

	<Field label="Verbal score">
		<strong class="text-base-content">{isNt ? 'NT' : score !== null ? score : '—'}</strong>
	</Field>
</Fieldset>
