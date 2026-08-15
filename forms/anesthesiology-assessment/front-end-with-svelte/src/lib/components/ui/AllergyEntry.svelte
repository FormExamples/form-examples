<script lang="ts">
	import type { Allergy } from '#lib/engine/types.js';

	let {
		allergies = $bindable<Allergy[]>([])
	}: {
		allergies: Allergy[];
	} = $props();

	const typeOptions = [
		{ value: 'drug', label: 'Drug' },
		{ value: 'latex', label: 'Latex' },
		{ value: 'food', label: 'Food' },
		{ value: 'environmental', label: 'Environmental' }
	];

	const severityOptions = [
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' },
		{ value: 'anaphylaxis', label: 'Anaphylaxis' }
	];

	function addAllergy() {
		allergies = [...allergies, { allergen: '', type: '', reaction: '', severity: '' }];
	}

	function removeAllergy(index: number) {
		allergies = allergies.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each allergies as allergy, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-4">
				<input
					type="text"
					placeholder="Allergen"
					bind:value={allergy.allergen}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<select
					bind:value={allergy.type}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				>
					<option value="">Type</option>
					{#each typeOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
				<input
					type="text"
					placeholder="Reaction"
					bind:value={allergy.reaction}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<select
					bind:value={allergy.severity}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				>
					<option value="">Severity</option>
					{#each severityOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
			<button
				type="button"
				onclick={() => removeAllergy(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove allergy"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addAllergy}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add allergy
	</button>
</div>
