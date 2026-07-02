<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeBhutani } from '$lib/engine/bhutani-grader';
	import {
		riskZoneColor,
		riskZoneLabel,
		percentileBandLabel,
		gestationBandLabel
	} from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(gradeBhutani(assessment.data));
</script>

<Fieldset legend="Step 5 of 5 — Summary and result">
	<p class="hint">
		Live risk zone, treatment-threshold comparison, and a free-text clinical note. Submit to
		generate the full report.
	</p>

	<Field label="Live risk zone">
		{#if grade.riskZone === null}
			<span class="text-sm text-base-content/60">Enter age and TSB to see the risk zone.</span>
		{:else}
			<span class="inline-flex flex-wrap items-center gap-3">
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskZoneColor(
						grade.riskZone
					)}"
				>
					{riskZoneLabel(grade.riskZone)}
				</span>
				<span class="text-sm text-base-content/70">
					{percentileBandLabel(grade.percentileBand)} · gestation band {gestationBandLabel(
						grade.gestationBand
					)}
				</span>
			</span>
		{/if}
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
