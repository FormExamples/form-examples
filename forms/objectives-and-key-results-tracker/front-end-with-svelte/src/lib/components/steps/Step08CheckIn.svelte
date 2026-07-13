<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="8. Check-in" data-step="8">
	<Field label="Narrative" inputId="checkInNarrative">
		<TextAreaInput id="checkInNarrative" label="Narrative" rows={3} bind:value={d.checkIn.narrative} />
	</Field>

	<Field label="Since last changes" inputId="checkInSinceLastChanges">
		<TextAreaInput
			id="checkInSinceLastChanges"
			label="Since last changes"
			rows={3}
			bind:value={d.checkIn.since_last_changes}
		/>
	</Field>

	<Field label="Blockers" inputId="checkInBlockers">
		<TextAreaInput id="checkInBlockers" label="Blockers" rows={3} bind:value={d.checkIn.blockers} />
	</Field>

	<Field label="Asks" inputId="checkInAsks">
		<TextAreaInput id="checkInAsks" label="Asks" rows={3} bind:value={d.checkIn.asks} />
	</Field>
</Fieldset>
