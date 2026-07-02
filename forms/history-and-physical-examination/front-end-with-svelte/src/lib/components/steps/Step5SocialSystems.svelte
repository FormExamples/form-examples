<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const h = assessment.data.history;
</script>

<Fieldset legend="Step 5 of 8 — Family, social history and systems review">
	<p class="hint">
		Family history (optional), social history (required), and a systems review (required).
	</p>

	<Field label="Family history" inputId="history-familyHistory">
		<TextAreaInput
			id="history-familyHistory"
			label="Family history"
			rows={2}
			placeholder="Relevant familial conditions, or explicit &quot;nil&quot;."
			bind:value={h.familyHistory}
		/>
	</Field>

	<Field label="Social history" inputId="history-socialHistory">
		<TextAreaInput
			id="history-socialHistory"
			label="Social history"
			rows={3}
			placeholder="Smoking, alcohol, occupation, living situation, functional baseline."
			bind:value={h.socialHistory}
		/>
	</Field>

	<Field label="Systems review" inputId="history-systemsReview">
		<TextAreaInput
			id="history-systemsReview"
			label="Systems review"
			rows={5}
			placeholder="Cardiovascular, respiratory, gastrointestinal, genitourinary, neurological, musculoskeletal, dermatological..."
			bind:value={h.systemsReview}
		/>
	</Field>
</Fieldset>
