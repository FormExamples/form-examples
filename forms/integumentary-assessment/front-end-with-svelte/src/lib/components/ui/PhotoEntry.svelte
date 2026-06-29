<script lang="ts">
	import type { Photo } from '$lib/engine/types';

	let {
		photos = $bindable<Photo[]>([])
	}: {
		photos: Photo[];
	} = $props();

	function addPhoto() {
		photos = [...photos, { site: '', date: '', reference: '' }];
	}

	function removePhoto(index: number) {
		photos = photos.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#if photos.length === 0}
		<p class="text-sm text-base-content/60">No photographs recorded.</p>
	{/if}
	{#each photos as photo, i}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input
					type="text"
					placeholder="Site"
					bind:value={photo.site}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="date"
					bind:value={photo.date}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Reference / filename"
					bind:value={photo.reference}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removePhoto(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove photograph"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addPhoto}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add photograph
	</button>
</div>
