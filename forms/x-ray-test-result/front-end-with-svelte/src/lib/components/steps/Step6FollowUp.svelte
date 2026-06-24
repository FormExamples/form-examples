<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Follow-up">
	<p class="hint">The recommended follow-up imaging, referral, or management.</p>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={4}
			placeholder="Recommended follow-up imaging, referral, or management…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
