<script lang="ts">
	// A single yes/no/unanswered checklist item built from Lily primitives:
	// Field wraps a RadioGroup of RadioInputs plus an evidence TextAreaInput.
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import RadioInput from '$lib/components/ui/RadioInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import type { ChecklistItem as ChecklistItemType } from '$lib/engine/types';

	let {
		item = $bindable(),
		heading,
		prompt,
		name,
	}: { item: ChecklistItemType; heading: string; prompt: string; name: string } = $props();

	const evidenceId = $derived(`${name}-evidence`);
</script>

<Field label={heading} description={prompt}>
	<RadioGroup label={heading}>
		<label class="radio-option">
			<RadioInput
				label="Yes"
				{name}
				checked={item.done === true}
				onchange={() => (item.done = true)}
			/>
			Yes
		</label>
		<label class="radio-option">
			<RadioInput
				label="No"
				{name}
				checked={item.done === false}
				onchange={() => (item.done = false)}
			/>
			No
		</label>
		<label class="radio-option">
			<RadioInput
				label="Unanswered"
				{name}
				checked={item.done === null}
				onchange={() => (item.done = null)}
			/>
			Unanswered
		</label>
	</RadioGroup>
</Field>

<Field label="Evidence (optional)" inputId={evidenceId} description="Note the evidence that supports this answer.">
	<TextAreaInput id={evidenceId} label="Evidence (optional)" rows={2} bind:value={item.evidence} />
</Field>
