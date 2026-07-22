<script lang="ts">
	// One PRO-measures item rendered as a radio group over a small fixed
	// response scale. Shared across the SF-36v2, NDI, and mJOA steps — each
	// instrument's item catalogue supplies its own `options` (see
	// $lib/config/scales.ts and the per-step option lists).
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	interface ScaleOption {
		value: number;
		label: string;
	}

	let {
		legend,
		number = undefined,
		options,
		name,
		value = $bindable<number | null>(null)
	}: {
		legend: string;
		number?: string;
		options: ScaleOption[];
		name: string;
		value?: number | null;
	} = $props();
</script>

<fieldset class="field radio-fieldset">
	<legend class="label">
		{#if number}
			<span class="text-sm font-semibold text-primary">{number}</span>
		{/if}
		<span class="block font-medium text-base-content">{legend}</span>
	</legend>

	<RadioGroup label={legend}>
		{#each options as opt (opt.value)}
			<label class="flex items-center gap-2">
				<input type="radio" class="radio-input" {name} value={opt.value} bind:group={value} />
				{opt.label}
			</label>
		{/each}
	</RadioGroup>
</fieldset>
