<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		prepSafetyLabel,
		prepSafetyColor,
		radiationDoseLabel,
		radiationDoseColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor
	} from '$lib/engine/utils';

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(request.data));
</script>

<Fieldset legend="8. Review and Submit">
	<p class="hint">Live four-axis vetting grade, radiation dose, safety flags, and the overall recommendation.</p>

	{#if preview.prepSafetyBand === 'contraindicated'}
		<Alert type="error" heading="Contraindicated">
			<p>
				A preparation-safety rule (e.g. pregnancy) makes this study contraindicated unless justified
				by exception. Discuss with the nuclear-medicine physician and ARSAC holder.
			</p>
		</Alert>
	{:else if preview.prepSafetyBand === 'caution'}
		<Alert type="warning" heading="Preparation caution">
			<p>A preparation-safety rule has fired (e.g. glucose control or breastfeeding); review before booking.</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Appropriateness</div>
			<Badge
				label={appropriatenessLabel(preview.appropriatenessBand)}
				color={appropriatenessColor(preview.appropriatenessBand)}
			/>
			<div class="mt-1 text-xs text-base-content/60">{preview.appropriatenessScore} / 9</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Preparation safety</div>
			<Badge label={prepSafetyLabel(preview.prepSafetyBand)} color={prepSafetyColor(preview.prepSafetyBand)} />
			<div class="mt-1">
				<Badge label={`Dose: ${radiationDoseLabel(preview.radiationDoseBand)}`} color={radiationDoseColor(preview.radiationDoseBand)} />
			</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Triage</div>
			<Badge label={triageTierLabel(preview.triageTier)} color={triageTierColor(preview.triageTier)} />
			<div class="mt-1 text-xs text-base-content/60">{preview.targetTimeframe}</div>
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
			<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
				{#each preview.flags as flag (flag.flagId)}
					<li><span class="font-medium">{flag.priority.toUpperCase()}</span> · {flag.description}</li>
				{/each}
			</ul>
		</div>
	{/if}
</Fieldset>
