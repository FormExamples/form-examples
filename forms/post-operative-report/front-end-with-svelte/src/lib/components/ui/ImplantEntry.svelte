<script lang="ts">
	import type { Implant } from '#lib/engine/types.js';

	let {
		implants = $bindable<Implant[]>([])
	}: {
		implants: Implant[];
	} = $props();

	function addImplant() {
		implants = [...implants, { description: '', manufacturer: '', lotNumber: '', site: '' }];
	}

	function removeImplant(index: number) {
		implants = implants.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each implants as implant, i}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-4">
				<input
					type="text"
					placeholder="Description"
					bind:value={implant.description}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Manufacturer"
					bind:value={implant.manufacturer}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Lot / Serial"
					bind:value={implant.lotNumber}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Site"
					bind:value={implant.site}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeImplant(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove implant"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addImplant}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add implant
	</button>
</div>
