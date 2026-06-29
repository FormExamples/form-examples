<script lang="ts">
	import { meeting } from '$lib/stores/meeting.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const o = meeting.data.organizer;
	const m = meeting.data.meta;
</script>

<Fieldset legend="Organiser & metadata">
	<p class="hint">Who is scheduling this meeting, and its current lifecycle status.</p>

	<Field label="Organiser name" inputId="organizerName">
		<TextInput id="organizerName" label="Organiser name" placeholder="e.g. Dana Lee" bind:value={o.name} />
	</Field>
	<Field label="Organiser email" inputId="organizerEmail">
		<TextInput id="organizerEmail" label="Organiser email" placeholder="name@example.com" bind:value={o.email} />
	</Field>
	<Field label="Organiser role" inputId="organizerRole">
		<TextInput id="organizerRole" label="Organiser role" placeholder="e.g. Scrum master" bind:value={o.role} />
	</Field>
	<Field label="Organisation" inputId="organizerOrganisation">
		<TextInput id="organizerOrganisation" label="Organisation" placeholder="e.g. Acme" bind:value={o.organisation} />
	</Field>
	<Field label="Team" inputId="organizerTeam">
		<TextInput id="organizerTeam" label="Team" placeholder="e.g. Platform" bind:value={o.team} />
	</Field>
	<Field label="Organiser time zone" inputId="organizerTimezone">
		<TextInput id="organizerTimezone" label="Organiser time zone" placeholder="e.g. Europe/London" bind:value={o.timezone} />
	</Field>

	<Field label="Status" inputId="status">
		<Select id="status" label="Status" bind:value={m.status}>
			<option value="draft">Draft</option>
			<option value="scheduled">Scheduled</option>
			<option value="in-progress">In progress</option>
			<option value="completed">Completed</option>
			<option value="cancelled">Cancelled</option>
		</Select>
	</Field>
</Fieldset>
