<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const t = assessment.data.traumaEvent;
</script>

<Fieldset legend="Trauma Event Identification">
	<p class="hint">The PCL-5 must be anchored to a specific traumatic event (DSM-5 Criterion A). Please briefly describe the worst event you have experienced.</p>

	<Field label="Event description (keep brief — you don't need to describe it in detail)" inputId="eventDescription">
		<TextAreaInput id="eventDescription" label="Event description" rows={3} bind:value={t.eventDescription} />
	</Field>
	<Field label="Event date (approximate is fine)" inputId="eventDate">
		<DateInput id="eventDate" label="Event date" bind:value={t.eventDate} />
	</Field>
	<Field label="Is the event still happening?">
		<label>
			<input type="checkbox" class="checkbox-input" bind:checked={t.isOngoing} />
			The event or situation is still happening
		</label>
	</Field>

	<Alert type="info">
		<strong>Following questions refer to this event.</strong> Please answer based on how much you have been bothered by each problem <em>in the past month</em>.
	</Alert>
</Fieldset>
