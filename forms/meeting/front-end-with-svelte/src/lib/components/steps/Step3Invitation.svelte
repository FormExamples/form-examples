<script lang="ts">
	import { meeting } from '#lib/stores/meeting.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const i = meeting.data.invitation;
</script>

<Fieldset legend="Invitation">
	<p class="hint">When and where the meeting happens, and how to join.</p>

	<Field label="Scheduled start" inputId="scheduledStartAt">
		<input id="scheduledStartAt" class="text-input" type="datetime-local" aria-label="Scheduled start" bind:value={i.scheduledStartAt} />
	</Field>
	<Field label="Scheduled end" inputId="scheduledEndAt">
		<input id="scheduledEndAt" class="text-input" type="datetime-local" aria-label="Scheduled end" bind:value={i.scheduledEndAt} />
	</Field>
	<Field label="Time zone" inputId="invTimezone">
		<TextInput id="invTimezone" label="Time zone" placeholder="e.g. Europe/London" bind:value={i.timezone} />
	</Field>
	<Field label="Location" inputId="location">
		<TextInput id="location" label="Location" placeholder="e.g. Room A / Head office" bind:value={i.location} />
	</Field>
	<Field label="Video link" inputId="videoUrl">
		<TextInput id="videoUrl" label="Video link" placeholder="https://meet.example.com/…" bind:value={i.videoUrl} />
	</Field>
	<Field label="Phone number" inputId="phoneNumber">
		<TextInput id="phoneNumber" label="Phone number" placeholder="+44 …" bind:value={i.phoneNumber} />
	</Field>
	<Field label="Dial-in code" inputId="dialInCode">
		<TextInput id="dialInCode" label="Dial-in code" placeholder="e.g. 123 456#" bind:value={i.dialInCode} />
	</Field>
	<Field label="Joining instructions" inputId="joiningInstructions">
		<TextAreaInput id="joiningInstructions" label="Joining instructions" rows={3} placeholder="Optional notes for attendees on how to join." bind:value={i.joiningInstructions} />
	</Field>
	<Field label="Calendar UID" inputId="calendarUid">
		<TextInput id="calendarUid" label="Calendar UID" placeholder="iCalendar UID (optional)" bind:value={i.calendarUid} />
	</Field>
</Fieldset>
