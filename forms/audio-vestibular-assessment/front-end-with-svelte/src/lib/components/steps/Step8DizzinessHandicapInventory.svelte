<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { DHI_ITEMS, dhiAnswerScore } from '#lib/engine/rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';

	const dhi = assessment.data.dizzinessHandicapInventory;

	const answerOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'sometimes', label: 'Sometimes' },
		{ value: 'no', label: 'No' }
	];

	const liveTotal = $derived(
		DHI_ITEMS.reduce((sum, item) => sum + dhiAnswerScore(dhi['q' + item.num]), 0)
	);
	const answered = $derived(
		DHI_ITEMS.filter((item) => dhi['q' + item.num] !== '').length
	);
</script>

<Fieldset legend="Dizziness Handicap Inventory (DHI)">
	<p class="hint">
		25 questions. For each, choose Yes (4 points), Sometimes (2 points), or No (0 points). Subscales:
		F = Functional, E = Emotional, P = Physical.
	</p>

	<p class="text-sm font-medium text-base-content/80">
		Running total: <span class="font-bold text-base-content">{liveTotal} / 100</span>
		<span class="text-base-content/60">({answered} of 25 answered)</span>
	</p>

	<div class="space-y-4">
		{#each DHI_ITEMS as item (item.num)}
			<fieldset class="rounded-lg border border-base-300 p-3">
				<legend class="px-1 text-sm text-base-content">
					<span class="font-semibold">{item.num}.</span>
					<span class="mr-1 rounded bg-base-200 px-1.5 py-0.5 text-xs font-semibold text-base-content/70">{item.subscale}</span>
					{item.text}
				</legend>
				<div class="mt-2 flex flex-wrap gap-4">
					{#each answerOptions as opt (opt.value)}
						<label class="flex items-center gap-1.5 text-sm">
							<input type="radio" class="radio-input" name={`dhi-q${item.num}`} value={opt.value} bind:group={dhi[`q${item.num}`]} />
							{opt.label}
						</label>
					{/each}
				</div>
			</fieldset>
		{/each}
	</div>
</Fieldset>
