<script lang="ts">
	// YesNo — a yes/no radio pair built on the Lily radio-group contract.
	import { RadioGroup } from "lily-design-system-svelte-headless";

	let {
		label,
		name,
		value = $bindable<string>('')
	}: {
		label: string;
		name: string;
		value?: string;
	} = $props();

	const options = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<RadioGroup {label}>
	{#each options as opt (opt.value)}
		<label class="radio-option">
			<input type="radio" class="radio-input" {name} value={opt.value} bind:group={value} />
			{opt.label}
		</label>
	{/each}
</RadioGroup>
