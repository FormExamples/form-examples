<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateMseGrade } from '$lib/engine/mse-grader';
	import {
		statusLabel,
		statusColor,
		riskLevelLabel,
		riskLevelColor
	} from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.summary;
	const grade = $derived(calculateMseGrade(assessment.data));
	const documented = $derived(grade.domainStatuses.filter((d) => d.documented).length);
</script>

<Fieldset legend="Step 10 of 10 — Summary and formulation">
	<p class="hint">
		Live completeness and risk, plus a free-text clinical formulation. Submit to generate the full
		report.
	</p>

	<Field label="Live completeness and risk">
		<div class="flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {statusColor(
					grade.status
				)}"
			>
				{statusLabel(grade.status)}
			</span>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskLevelColor(
					grade.riskLevel
				)}"
			>
				Risk: {riskLevelLabel(grade.riskLevel)}
			</span>
			<span class="text-sm text-base-content/70">
				{documented} of {grade.domainStatuses.length} ASEPTIC domains documented ({grade.completenessPercent}%);
				{grade.flags.length}
				{grade.flags.length === 1 ? 'flag' : 'flags'} raised.
			</span>
		</div>
	</Field>

	<Field label="Clinical formulation" inputId="summary-clinicalFormulation">
		<TextAreaInput
			id="summary-clinicalFormulation"
			label="Clinical formulation"
			rows={5}
			placeholder="Free-text formulation drawing the domains together, with the risk summary and plan."
			bind:value={s.clinicalFormulation}
		/>
	</Field>
</Fieldset>
