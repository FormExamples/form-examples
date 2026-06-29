<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import {
		bleedingRiskLabel,
		bleedingRiskColor,
		priorityColor
	} from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';

	// Live preview, recomputed reactively as the request data changes.
	const result = $derived(calculateGrade(request.data));
</script>

<Fieldset legend="Risk & safety review">
	<p class="hint">
		Live preview of the computed bleeding-risk band and safety flags as you complete the request.
	</p>

	<div class="mb-4 flex flex-wrap gap-2">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-semibold {bleedingRiskColor(result.bleedingRiskBand)}">
			Bleeding risk: {bleedingRiskLabel(result.bleedingRiskBand)}
		</span>
		{#if result.twoWeekWaitEligible}
			<span class="inline-block rounded-full border px-3 py-1 text-sm font-semibold bg-info text-info-content border-info">
				Two-week-wait eligible
			</span>
		{/if}
	</div>

	<p class="text-sm text-base-content/70">{result.anticoagulantAction}</p>

	{#if result.flags.length === 0}
		<p class="mt-4 text-sm text-base-content/60">No safety flags raised yet.</p>
	{:else}
		<ul class="mt-4 space-y-2">
			{#each result.flags as flag (flag.flagId)}
				<li class="flex flex-wrap items-start gap-2 rounded-lg border p-3 {priorityColor(flag.priority)}">
					<span class="rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
						{flag.priority}
					</span>
					<span class="font-medium">{flag.category}:</span>
					<span>{flag.description}</span>
					<span class="w-full text-sm opacity-80">{flag.suggestedAction}</span>
				</li>
			{/each}
		</ul>
	{/if}
</Fieldset>
