<script lang="ts">
	import type { Lesion } from '#lib/engine/types.js';

	let {
		lesions = $bindable<Lesion[]>([])
	}: {
		lesions: Lesion[];
	} = $props();

	function addLesion() {
		lesions = [...lesions, { site: '', type: '', size: '', description: '' }];
	}

	function removeLesion(index: number) {
		lesions = lesions.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#if lesions.length === 0}
		<p class="text-sm text-base-content/60">No specific lesions documented.</p>
	{/if}
	{#each lesions as lesion, i}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-4">
				<input
					type="text"
					placeholder="Site"
					bind:value={lesion.site}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Type"
					bind:value={lesion.type}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Size"
					bind:value={lesion.size}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Description"
					bind:value={lesion.description}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeLesion(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove lesion"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addLesion}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add lesion
	</button>
</div>
