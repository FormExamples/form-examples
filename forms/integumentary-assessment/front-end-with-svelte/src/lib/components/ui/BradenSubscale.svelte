<script lang="ts">
	// A single Braden Scale subscale rendered as a stacked radio group. Each
	// option carries a numeric value plus a short title and a full description.
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	let {
		name,
		label,
		options,
		value = $bindable<number | null>(null)
	}: {
		name: string;
		label: string;
		options: { value: number; title: string; desc: string }[];
		value: number | null;
	} = $props();
</script>

<RadioGroup {label} class="braden-subscale">
	<legend class="mb-2 block text-sm font-semibold text-base-content">{label}</legend>
	<div class="space-y-2">
		{#each options as opt (opt.value)}
			<label class="flex cursor-pointer items-start gap-3 rounded-lg border border-base-300 bg-base-100 p-3 hover:border-primary">
				<input
					type="radio"
					class="radio-input mt-1"
					{name}
					value={opt.value}
					bind:group={value}
				/>
				<span class="text-sm">
					<span class="block font-semibold text-base-content">{opt.value}. {opt.title}</span>
					<span class="block text-base-content/70">{opt.desc}</span>
				</span>
			</label>
		{/each}
	</div>
</RadioGroup>
