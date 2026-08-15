<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Clinical Assessment">
	<p class="hint">The clinical summary, examination, and investigations performed or reviewed.</p>

	<Field label="Clinical summary" inputId="clinicalSummary" required>
		<TextAreaInput
			id="clinicalSummary"
			label="Clinical summary"
			rows={5}
			placeholder="Narrative clinical summary of the assessment and the referral question…"
			bind:value={d.clinicalSummary}
		/>
	</Field>

	<Field label="Examination findings" inputId="examinationFindings">
		<TextAreaInput
			id="examinationFindings"
			label="Examination findings"
			rows={3}
			placeholder="Cardiovascular examination findings (pulse, heart sounds, murmurs, signs of failure)…"
			bind:value={d.examinationFindings}
		/>
	</Field>

	<Field label="Investigations performed" inputId="investigationsPerformed">
		<TextAreaInput
			id="investigationsPerformed"
			label="Investigations performed"
			rows={3}
			placeholder="Investigations performed or reviewed (ECG, echocardiogram, stress test) and their findings…"
			bind:value={d.investigationsPerformed}
		/>
	</Field>
</Fieldset>
