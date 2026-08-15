<script lang="ts">
	import type { Relative } from '#lib/engine/types.js';
	import { emptyRelative } from '#lib/engine/factory.js';
	import RelativeEntry from './RelativeEntry.svelte';

	let {
		relatives = $bindable<Relative[]>([]),
		label,
		hint = undefined,
		addLabel,
		defaultRelation,
		side,
		generation
	}: {
		relatives: Relative[];
		label: string;
		hint?: string;
		addLabel: string;
		defaultRelation: string;
		side: 'maternal' | 'paternal' | 'self' | '';
		generation: 1 | 2 | 3;
	} = $props();

	function add() {
		relatives = [...relatives, emptyRelative({ relation: defaultRelation, side, generation })];
	}

	function remove(index: number) {
		relatives = relatives.filter((_, i) => i !== index);
	}
</script>

<div class="mt-4">
	<h4 class="text-sm font-semibold text-base-content">{label}</h4>
	{#if hint}<p class="hint">{hint}</p>{/if}

	<div class="mt-2 space-y-3">
		{#if relatives.length === 0}
			<p class="text-sm text-base-content/60">None added.</p>
		{/if}
		{#each relatives as relative, i (relative.id)}
			<div class="rounded-lg border border-base-300 bg-base-100 p-3">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-semibold text-base-content">{defaultRelation} #{i + 1}</span>
					<button
						type="button"
						onclick={() => remove(i)}
						class="text-error"
						aria-label="Remove relative"
					>
						Remove
					</button>
				</div>
				<RelativeEntry {relative} showSex />
			</div>
		{/each}

		<button
			type="button"
			onclick={add}
			class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
		>
			+ {addLabel}
		</button>
	</div>
</div>
