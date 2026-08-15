<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { calculateGrade } from '#lib/engine/grader.js';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		contraindicationLabel,
		contraindicationColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor
	} from '#lib/engine/utils.js';

	const d = request.data;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(d));
</script>

<Fieldset legend="7. Review and Submit">
	<p class="hint">Live four-axis vetting grade, safety flags, and the overall recommendation.</p>

	{#if preview.contraindicationBand === 'contraindicated'}
		<Alert type="error" heading="Contraindicated">
			<p>
				This request fired an absolute contraindication (recent ACS or severe symptomatic aortic
				stenosis). Do not perform the stress test as requested; arrange the appropriate alternative
				pathway.
			</p>
		</Alert>
	{:else if preview.triageTier === 'emergency'}
		<Alert type="error" heading="Emergency triage">
			<p>This request has been auto-escalated to the emergency pathway.</p>
		</Alert>
	{:else if preview.contraindicationBand === 'caution'}
		<Alert type="warning" heading="Proceed with caution">
			<p>This request fired a relative contraindication and may need redirecting to another modality.</p>
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
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Safety</div>
			<Badge
				label={contraindicationLabel(preview.contraindicationBand)}
				color={contraindicationColor(preview.contraindicationBand)}
			/>
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

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes accompanying the request…"
			bind:value={d.triage.notes}
		/>
	</Field>
</Fieldset>
