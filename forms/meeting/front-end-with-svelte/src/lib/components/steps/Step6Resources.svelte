<script lang="ts">
	import { meeting } from '$lib/stores/meeting.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import type { ResourceItem } from '$lib/engine/types';

	const d = meeting.data;

	function add() {
		d.resources = [
			...d.resources,
			{ resourceType: '', name: '', quantity: null, costAmount: null, status: '' } satisfies ResourceItem
		];
	}
	function remove(i: number) {
		d.resources = d.resources.filter((_, idx) => idx !== i);
	}
</script>

<Fieldset legend="Resources">
	<p class="hint">Rooms, equipment, documents, budget — anything the meeting needs.</p>

	<div class="space-y-3">
		{#each d.resources as r, i (i)}
			<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
				<span class="mt-2 text-sm font-semibold text-base-content/60">{i + 1}</span>
				<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
					<select class="select" aria-label="Resource type" bind:value={r.resourceType}>
						<option value="">Type…</option>
						<option value="room">Room</option>
						<option value="equipment">Equipment</option>
						<option value="document">Document</option>
						<option value="link">Link</option>
						<option value="budget">Budget</option>
						<option value="catering">Catering</option>
						<option value="interpreter">Interpreter</option>
						<option value="transport">Transport</option>
						<option value="other">Other</option>
					</select>
					<input class="text-input" type="text" placeholder="Name" aria-label="Resource name" bind:value={r.name} />
					<input class="number-input" type="number" min="0" placeholder="Quantity" aria-label="Resource quantity" bind:value={r.quantity} />
					<input class="number-input" type="number" min="0" step="0.01" placeholder="Cost" aria-label="Resource cost" bind:value={r.costAmount} />
					<select class="select sm:col-span-2" aria-label="Resource status" bind:value={r.status}>
						<option value="">Status…</option>
						<option value="requested">Requested</option>
						<option value="reserved">Reserved</option>
						<option value="confirmed">Confirmed</option>
						<option value="unavailable">Unavailable</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>
				<button type="button" class="mt-1 text-error" onclick={() => remove(i)} aria-label="Remove resource">&times;</button>
			</div>
		{/each}

		<button
			type="button"
			onclick={add}
			class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
		>
			+ Add resource
		</button>
	</div>
</Fieldset>
