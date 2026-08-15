<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCurb65Grade } from '#lib/engine/curb65-grader.js';
	import { riskBandLabel, riskBandColor, scoreVariantLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.disposition;
	const grade = $derived(calculateCurb65Grade(assessment.data));
	const maxScore = $derived(grade.scoreVariant === 'curb-65' ? 5 : 4);
</script>

<Fieldset legend="Step 9 of 9 — Score and disposition">
	<p class="hint">
		Live severity score and an optional clinician override. Submit to generate the full report.
	</p>

	<Field label="Live severity score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content"
				>{scoreVariantLabel(grade.scoreVariant)} {grade.totalScore} of {maxScore}</strong
			>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(
					grade.riskBand
				)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
		</span>
	</Field>

	<Field
		label="Clinician override — final risk band"
		description="Optional. Override the computed band when clinical judgement differs; record a reason."
		inputId="disposition-clinicianOverrideBand"
	>
		<Select
			id="disposition-clinicianOverrideBand"
			label="Clinician override — final risk band"
			bind:value={d.clinicianOverrideBand}
		>
			<option value="">— No override —</option>
			<option value="low">Low</option>
			<option value="intermediate">Intermediate</option>
			<option value="high">High</option>
		</Select>
	</Field>

	<Field label="Override reason" inputId="disposition-overrideReason">
		<TextAreaInput
			id="disposition-overrideReason"
			label="Override reason"
			rows={2}
			placeholder="Why the final disposition differs from the computed band."
			bind:value={d.overrideReason}
		/>
	</Field>

	<Field label="Clinical note" inputId="disposition-clinicalNote">
		<TextAreaInput
			id="disposition-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={d.clinicalNote}
		/>
	</Field>
</Fieldset>
