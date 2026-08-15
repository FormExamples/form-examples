<script lang="ts">
	import type { TravelEntry } from '#lib/engine/types.js';

	let {
		entries = $bindable<TravelEntry[]>([])
	}: {
		entries: TravelEntry[];
	} = $props();

	function addEntry() {
		entries = [...entries, { country: '', returnDate: '', duration: '' }];
	}

	function removeEntry(index: number) {
		entries = entries.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each entries as entry, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input
					type="text"
					placeholder="Country / region"
					bind:value={entry.country}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="date"
					aria-label="Return date"
					bind:value={entry.returnDate}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Duration (e.g. 2 weeks)"
					bind:value={entry.duration}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeEntry(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove travel entry"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addEntry}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add travel entry
	</button>
</div>
