<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { motorOptions, scoreFor } from '$lib/engine/gcs-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const m = assessment.data.motor;
	const score = $derived(scoreFor(motorOptions, m.motorResponse));
	const isNt = $derived(m.motorResponse === 'NT');
</script>

<Fieldset legend="Step 5 of 8 — Motor response (M)">
	<p class="hint">
		Best motor response (M, 1-6), or NT when it cannot be tested. Record the response in the best-
		responding limb.
	</p>

	<Field label="Motor response" inputId="motor-motorResponse">
		<Select id="motor-motorResponse" label="Motor response" bind:value={m.motorResponse}>
			<option value="">— Select —</option>
			{#each motorOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	{#if isNt}
		<Field label="Reason not testable" inputId="motor-motorNotTestableReason">
			<TextInput
				id="motor-motorNotTestableReason"
				label="Reason not testable"
				placeholder="e.g. neuromuscular blockade, spinal injury"
				bind:value={m.motorNotTestableReason}
			/>
		</Field>
	{/if}

	<Field label="Motor score">
		<strong class="text-base-content">{isNt ? 'NT' : score !== null ? score : '—'}</strong>
	</Field>
</Fieldset>
