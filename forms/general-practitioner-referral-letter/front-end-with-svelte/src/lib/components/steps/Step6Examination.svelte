<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.examination;
</script>

<Fieldset legend="Step 6 of 9 — Examination and investigations">
	<p class="hint">Relevant examination findings and any investigations already done.</p>

	<Field label="Examination findings" inputId="examination-examinationFindings">
		<TextAreaInput
			id="examination-examinationFindings"
			label="Examination findings"
			rows={3}
			placeholder="Relevant examination findings and vital signs."
			bind:value={e.examinationFindings}
		/>
	</Field>

	<Field label="Investigation results" inputId="examination-investigationResults">
		<TextAreaInput
			id="examination-investigationResults"
			label="Investigation results"
			rows={3}
			placeholder="e.g. FBC: Hb 98 g/L; ferritin 8 µg/L. FIT positive."
			bind:value={e.investigationResults}
		/>
	</Field>
</Fieldset>
