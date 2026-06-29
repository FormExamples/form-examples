<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		triageTierLabel,
		triageTierColor,
		priorityLabel,
		priorityColor,
		recommendationLabel,
		recommendationColor,
		flagPriorityColor
	} from '$lib/engine/utils';

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(request.data));
</script>

<Fieldset legend="7. Review and Submit">
	<p class="hint">Live four-axis vetting grade, safety flags, and the overall recommendation.</p>

	{#if preview.triageTier === 'emergency'}
		<Alert type="error" heading="Emergency triage">
			<p>
				This request contains an acute red flag (suspected ACS or active chest pain). Perform an
				emergency, same-hour 12-lead ECG; do not wait for a routine booking.
			</p>
		</Alert>
	{:else if preview.flags.some((f) => f.priority === 'high')}
		<Alert type="warning" heading="Red-flag request">
			<p>This request fired a red-flag safety rule and has been escalated for urgent vetting.</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Appropriateness</div>
			<Badge
				label={`${appropriatenessLabel(preview.appropriatenessBand)} (${preview.appropriatenessScore}/9)`}
				color={appropriatenessColor(preview.appropriatenessBand)}
			/>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Triage</div>
			<Badge label={triageTierLabel(preview.triageTier)} color={triageTierColor(preview.triageTier)} />
			<div class="mt-1 text-xs text-base-content/60">{preview.targetTimeframe}</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Clinical priority</div>
			<Badge label={priorityLabel(preview.priorityBand)} color={priorityColor(preview.priorityBand)} />
		</div>
	</div>

	<div class="my-4 rounded-lg border border-base-300 p-3">
		<div class="mb-1 text-xs font-semibold text-base-content/60">Overall recommendation</div>
		<Badge
			label={recommendationLabel(preview.recommendation)}
			color={recommendationColor(preview.recommendation)}
		/>
	</div>

	{#if preview.flags.length > 0}
		<div class="my-4 rounded-lg border border-base-300 p-3">
			<div class="mb-2 text-xs font-semibold text-base-content/60">Safety flags</div>
			<ul class="space-y-2 text-sm">
				{#each preview.flags as flag (flag.flagId)}
					<li class="flex items-start gap-2">
						<span class="rounded px-2 py-0.5 text-xs font-bold uppercase {flagPriorityColor(flag.priority)}">
							{flag.priority}
						</span>
						<span class="text-base-content/80">{flag.description}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</Fieldset>
