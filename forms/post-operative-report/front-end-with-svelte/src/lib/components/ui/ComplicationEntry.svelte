<script lang="ts">
	import type { Complication } from '$lib/engine/types';
	import { clavienDindoRules } from '$lib/engine/clavien-dindo-rules';

	let {
		complications = $bindable<Complication[]>([])
	}: {
		complications: Complication[];
	} = $props();

	const gradeOptions = clavienDindoRules.map((r) => ({
		value: r.grade,
		label: `${r.label} — ${r.shortLabel}`
	}));

	function addComplication() {
		complications = [
			...complications,
			{ description: '', grade: '', interventionRequired: '', timing: '' }
		];
	}

	function removeComplication(index: number) {
		complications = complications.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each complications as complication, i}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
				<input
					type="text"
					placeholder="Description"
					bind:value={complication.description}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<select
					bind:value={complication.grade}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				>
					<option value="">— Select grade —</option>
					{#each gradeOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
				<input
					type="text"
					placeholder="Intervention"
					bind:value={complication.interventionRequired}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Timing (e.g. POD 2)"
					bind:value={complication.timing}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeComplication(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove complication"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addComplication}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add complication
	</button>
</div>
