<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { classifyAaa } from '#lib/engine/aaa-grader.js';
	import {
		categoryColor,
		categoryLabel,
		surveillanceBandLabel,
		formatDiameter
	} from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.result;
	const grade = $derived(classifyAaa(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and result">
	<p class="hint">
		Live classification, surveillance band, and a free-text result note. Submit to generate the full
		report.
	</p>

	<Field label="Live classification">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{formatDiameter(grade.maxAorticDiameterCm)}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {categoryColor(
					grade.category
				)}"
			>
				{categoryLabel(grade.category)}
			</span>
			<span class="text-sm text-base-content/70">{surveillanceBandLabel(grade.surveillanceBand)}</span>
		</span>
	</Field>

	<Field label="Result note" inputId="result-resultNote">
		<TextAreaInput
			id="result-resultNote"
			label="Result note"
			rows={4}
			placeholder="Free-text result note: outcome, decisions, and any referral or surveillance actioned."
			bind:value={r.resultNote}
		/>
	</Field>
</Fieldset>
