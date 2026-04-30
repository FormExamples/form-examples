<script lang="ts">
	import type { YesNo } from '$lib/engine/types';
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

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<RadioGroup {label} {name} options={yesNoOptions} bind:value {required} />
