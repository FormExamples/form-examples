<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { qolResponseOptions } from '$lib/engine/ipss-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import type { QoLScore } from '$lib/engine/types';

	const qol = assessment.data.qualityOfLife;

	function setQolScore(value: number) {
		assessment.data.qualityOfLife.qolScore = value as QoLScore;
	}
</script>

<Fieldset title="Quality of Life" description="IPSS Quality of Life assessment - how do your urinary symptoms affect your daily life?">
	<div class="mb-6">
		<p class="mb-3 text-sm font-medium text-base-content/70">
			If you were to spend the rest of your life with your urinary condition just the way it is now, how would you feel about that?
		</p>
		<div class="flex flex-wrap gap-2">
			{#each qolResponseOptions as opt}
				<label
					class="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors
						{qol.qolScore === opt.value ? 'border-primary bg-primary/10 font-medium' : 'border-base-300 bg-base-100 hover:bg-base-200'}"
				>
					<input
						type="radio"
						name="qol-score"
						value={opt.value}
						checked={qol.qolScore === opt.value}
						onchange={() => setQolScore(opt.value)}
						class="text-primary accent-primary"
					/>
					{opt.label}
				</label>
			{/each}
		</div>
	</div>

	<TextAreaInput
		label="How do your urinary symptoms impact your daily life?"
		name="qolImpact"
		bind:value={qol.qolImpact}
		placeholder="Describe how your symptoms affect work, sleep, travel, social activities..."
	/>
</Fieldset>
