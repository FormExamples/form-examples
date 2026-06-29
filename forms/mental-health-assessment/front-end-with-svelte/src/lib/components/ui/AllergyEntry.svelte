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

<div class="allergy-list">
	{#each allergies as allergy, i (i)}
		<div class="allergy-row">
			<input type="text" placeholder="Allergen" bind:value={allergy.allergen} class="text-input" aria-label="Allergen" />
			<input type="text" placeholder="Reaction" bind:value={allergy.reaction} class="text-input" aria-label="Reaction" />
			<select bind:value={allergy.severity} class="select" aria-label="Severity">
				<option value="">Severity</option>
				{#each severityOptions as opt (opt.value)}
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
				&times;
			</button>
		</div>
	{/each}

	<button type="button" class="button" onclick={addAllergy}>
		+ Add Allergy
	</button>
</div>

<style>
	.allergy-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.allergy-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr) auto;
		gap: 0.5rem;
		align-items: center;
	}
	@media (max-width: 640px) {
		.allergy-row { grid-template-columns: 1fr; }
	}
</style>
