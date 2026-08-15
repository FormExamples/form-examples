<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const h = assessment.data.historyOfPresentIllness;
</script>

<Fieldset
	title="History of Present Illness"
	description="Document symptoms, time course, exacerbating and alleviating factors, prior episodes and prior interventions (including any primary health care)."
>
	<TextAreaInput
		label="Narrative"
		name="hpiNarrative"
		bind:value={h.narrative}
		rows={6}
		required
		placeholder="Onset, character, radiation, associated symptoms, timing, prior treatment etc."
	/>
</Fieldset>
