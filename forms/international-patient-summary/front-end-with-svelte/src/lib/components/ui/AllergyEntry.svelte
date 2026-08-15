<script lang="ts">
	import type { Allergy, ClinicalSeverity, AllergyCriticality } from '#lib/engine/types.js';

	let {
		allergies = $bindable<Allergy[]>([])
	}: {
		allergies: Allergy[];
	} = $props();

	const severityOptions: { value: ClinicalSeverity; label: string }[] = [
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
	const criticalityOptions: { value: AllergyCriticality; label: string }[] = [
		{ value: 'low', label: 'Low' },
		{ value: 'high', label: 'High' },
		{ value: 'unable-to-assess', label: 'Unable to assess' }
	];

	function add() {
		allergies = [...allergies, { substance: '', reaction: '', severity: '', criticality: '' }];
	}
	function remove(index: number) {
		allergies = allergies.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each allergies as allergy, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-4">
				<input type="text" placeholder="Substance" bind:value={allergy.substance} class="text-input" />
				<input type="text" placeholder="Reaction" bind:value={allergy.reaction} class="text-input" />
				<select bind:value={allergy.severity} class="select" aria-label="Severity">
					<option value="">Severity</option>
					{#each severityOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
				<select bind:value={allergy.criticality} class="select" aria-label="Criticality">
					<option value="">Criticality</option>
					{#each criticalityOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
			<button type="button" onclick={() => remove(i)} class="mt-1 text-error" aria-label="Remove allergy">&times;</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add allergy / intolerance
	</button>
</div>
