<script lang="ts">
	import type { Relative } from '#lib/engine/types.js';
	import RelativeCancerList from './RelativeCancerList.svelte';

	let {
		relative,
		showSex = false
	}: {
		relative: Relative;
		showSex?: boolean;
	} = $props();
</script>

<div class="space-y-2">
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
		<label class="block text-sm">
			<span class="text-base-content/70">Name (optional)</span>
			<input type="text" bind:value={relative.name} class="text-input" placeholder="Initials or first name" />
		</label>
		{#if showSex}
			<label class="block text-sm">
				<span class="text-base-content/70">Sex</span>
				<select bind:value={relative.sex} class="select" aria-label="Sex">
					<option value="">—</option>
					<option value="female">Female</option>
					<option value="male">Male</option>
					<option value="other">Other / unknown</option>
				</select>
			</label>
		{/if}
		<label class="block text-sm">
			<span class="text-base-content/70">Affected with cancer?</span>
			<select bind:value={relative.affectedWithCancer} class="select" aria-label="Affected with cancer">
				<option value="">—</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="unknown">Unknown</option>
			</select>
		</label>
	</div>

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
		<label class="block text-sm">
			<span class="text-base-content/70">Deceased?</span>
			<select bind:value={relative.deceased} class="select" aria-label="Deceased">
				<option value="">—</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="unknown">Unknown</option>
			</select>
		</label>
		<label class="block text-sm">
			<span class="text-base-content/70">Age at death</span>
			<input type="number" min="0" max="120" bind:value={relative.ageAtDeath} class="number-input" />
		</label>
		<label class="block text-sm">
			<span class="text-base-content/70">Cause of death</span>
			<input type="text" bind:value={relative.causeOfDeath} class="text-input" placeholder="If known" />
		</label>
	</div>

	<label class="block text-sm">
		<span class="text-base-content/70">Notes (other conditions)</span>
		<input type="text" bind:value={relative.notes} class="text-input" placeholder="e.g. cardiac, neurological" />
	</label>

	<RelativeCancerList bind:cancers={relative.cancers} />
</div>
