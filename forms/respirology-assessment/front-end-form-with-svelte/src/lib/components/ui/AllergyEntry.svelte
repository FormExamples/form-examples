<script lang="ts">
	import type { Allergy, AllergySeverity } from '$lib/engine/types';

	let { allergies = $bindable<Allergy[]>([]) }: { allergies: Allergy[] } = $props();

	const severityOptions: { value: AllergySeverity; label: string }[] = [
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'anaphylaxis', label: 'Anaphylaxis' }
	];

	function addAllergy() { allergies = [...allergies, { allergen: '', reaction: '', severity: '' }]; }
	function removeAllergy(index: number) { allergies = allergies.filter((_, i) => i !== index); }
</script>

<div class="entry-list">
	{#each allergies as allergy, i}
		<div class="entry-row">
			<div class="entry-grid">
				<input class="text-input" type="text" placeholder="Allergen" bind:value={allergy.allergen} />
				<input class="text-input" type="text" placeholder="Reaction" bind:value={allergy.reaction} />
				<select class="select" bind:value={allergy.severity}>
					<option value="">Severity</option>
					{#each severityOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
				</select>
			</div>
			<button class="button" type="button" data-variant="danger" onclick={() => removeAllergy(i)} aria-label="Remove allergy">&times;</button>
		</div>
	{/each}
	<button class="button" type="button" onclick={addAllergy}>+ Add Allergy</button>
</div>

<style>
	.entry-list { display: flex; flex-direction: column; gap: 0.75rem; }
	.entry-row { display: flex; align-items: flex-start; gap: 0.5rem; border: 1px solid var(--color-border); background: var(--color-bg); border-radius: 0.5rem; padding: 0.75rem; }
	.entry-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; flex: 1; }
	@media (max-width: 640px) { .entry-grid { grid-template-columns: 1fr; } }
</style>
