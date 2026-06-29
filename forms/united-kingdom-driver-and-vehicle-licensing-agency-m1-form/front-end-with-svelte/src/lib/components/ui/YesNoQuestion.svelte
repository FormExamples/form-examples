<script lang="ts">
	// YesNoQuestion — Lily-shaped convenience that wraps Field + RadioGroup
	// emitting Lily class names (radio-group, radio-input).
	import type { YesNo } from '$lib/engine/types';
	import Field from './Field.svelte';
	import RadioGroup from './RadioGroup.svelte';

	let {
		label,
		name,
		value = $bindable<YesNo>(''),
		required = false
	}: {
		label: string;
		name: string;
		value: YesNo;
		required?: boolean;
	} = $props();
</script>

<Field {label} {required}>
	<RadioGroup {label}>
		<label>
			<input
				type="radio"
				class="radio-input"
				{name}
				value="yes"
				bind:group={value}
				{required}
			/>
			Yes
		</label>
		<label>
			<input
				type="radio"
				class="radio-input"
				{name}
				value="no"
				bind:group={value}
				{required}
			/>
			No
		</label>
	</RadioGroup>
</Field>
