<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const b = assessment.data.background;
</script>

<Fieldset
	title="Background"
	description="The second part of the SBAR framework. Briefly describe the relevant history and significant events during the referral episode."
>
	<TextAreaInput
		label="Brief history of present illness"
		name="historyOfPresentIllness"
		bind:value={b.historyOfPresentIllness}
		rows={3}
		required
	/>

	<TextAreaInput
		label="Relevant past medical history"
		name="pastMedicalHistory"
		bind:value={b.pastMedicalHistory}
		rows={3}
		required
	/>

	<TextAreaInput
		label="Significant investigations or events during the referral episode"
		name="significantEvents"
		bind:value={b.significantEvents}
		rows={3}
		placeholder="Notable investigations, procedures, complications, or other events."
	/>
</Fieldset>
