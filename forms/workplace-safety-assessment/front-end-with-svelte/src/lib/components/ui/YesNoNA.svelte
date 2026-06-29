<script lang="ts">
	// YesNoNA — a Yes / No / N/A checklist item built from the Lily headless
	// Field + RadioGroup contract. The bound value uses '' for unanswered,
	// 'yes' | 'no' | 'na' otherwise. `id` is the stable input name/anchor id.
	import Field from './Field.svelte';
	import RadioGroup from './RadioGroup.svelte';
	import type { YesNoNA } from '$lib/engine/types';

	let {
		id,
		label,
		value = $bindable<YesNoNA>('')
	}: {
		id: string;
		label: string;
		value?: YesNoNA;
	} = $props();
</script>

<Field {label} inputId={id}>
	<RadioGroup {label}>
		<label>
			<input type="radio" class="radio-input" name={id} value="yes" bind:group={value} /> Yes
		</label>
		<label>
			<input type="radio" class="radio-input" name={id} value="no" bind:group={value} /> No
		</label>
		<label>
			<input type="radio" class="radio-input" name={id} value="na" bind:group={value} /> N/A
		</label>
	</RadioGroup>
</Field>
