<script lang="ts">
	import type { Allergy, AllergySeverity } from '$lib/engine/types';

	let {
		allergies = $bindable<Allergy[]>([])
	}: {
		allergies: Allergy[];
	} = $props();

	const severityOptions: { value: AllergySeverity; label: string }[] = [
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'anaphylaxis', label: 'Anaphylaxis' }
	];

	function addAllergy() {
		allergies = [...allergies, { allergen: '', reaction: '', severity: '' }];
	}

	function removeAllergy(index: number) {
		allergies = allergies.filter((_, i) => i !== index);
	}
</script>

<div class="entry-list">
	{#each allergies as allergy, i (i)}
		<div class="entry-row">
			<input
				type="text"
				class="text-input"
				placeholder="Allergen"
				aria-label="Allergen"
				bind:value={allergy.allergen}
			/>
			<input
				type="text"
				class="text-input"
				placeholder="Reaction"
				aria-label="Reaction"
				bind:value={allergy.reaction}
			/>
			<select class="select" aria-label="Severity" bind:value={allergy.severity}>
				<option value="">Severity</option>
				{#each severityOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
			<button
				type="button"
				class="button"
				data-variant="danger"
				onclick={() => removeAllergy(i)}
				aria-label="Remove allergy"
			>
				Remove
			</button>
		</div>
	{/each}

	<button type="button" class="button" onclick={addAllergy}>
		+ Add Allergy
	</button>
</div>

<style>
	.entry-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.entry-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr auto;
		gap: 0.5rem;
		align-items: end;
	}
	@media (max-width: 640px) {
		.entry-row { grid-template-columns: 1fr; }
	}
</style>
