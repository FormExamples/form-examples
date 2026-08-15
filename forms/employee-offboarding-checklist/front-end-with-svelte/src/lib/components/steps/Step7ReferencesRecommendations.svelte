<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoRadio from '#lib/components/ui/YesNoRadio.svelte';

	const d = assessment.data.referencesRecommendations;
</script>

<Fieldset legend="References & Recommendations">
	<p class="hint">Record the employee's position on references and any recommendation letters.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Reference consent given">
			<YesNoRadio label="Reference consent given" name="referenceConsentGiven" bind:value={d.referenceConsentGiven} />
		</Field>
		<Field label="Reference contact details recorded">
			<YesNoRadio label="Reference contact details recorded" name="referenceContactDetailsRecorded" bind:value={d.referenceContactDetailsRecorded} />
		</Field>
		<Field label="Recommendation letter requested">
			<YesNoRadio label="Recommendation letter requested" name="recommendationLetterRequested" bind:value={d.recommendationLetterRequested} />
		</Field>
		<Field label="Recommendation letter provided">
			<YesNoRadio label="Recommendation letter provided" name="recommendationLetterProvided" bind:value={d.recommendationLetterProvided} />
		</Field>
		<Field label="Reference policy explained">
			<YesNoRadio label="Reference policy explained" name="referencePolicyExplained" bind:value={d.referencePolicyExplained} />
		</Field>
	</div>

	<Field label="Notes" inputId="referencesNotes">
		<TextAreaInput id="referencesNotes" label="Notes" rows={3} bind:value={d.referencesNotes} />
	</Field>
</Fieldset>
