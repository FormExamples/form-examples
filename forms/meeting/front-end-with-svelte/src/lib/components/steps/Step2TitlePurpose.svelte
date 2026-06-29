<script lang="ts">
	import { meeting } from '$lib/stores/meeting.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const m = meeting.data.meta;
</script>

<Fieldset legend="Title & purpose">
	<p class="hint">A clear title, a one-sentence purpose, and the meeting category.</p>

	<Field label="Meeting title" inputId="title">
		<TextInput id="title" label="Meeting title" placeholder="e.g. Sprint 24 planning" bind:value={m.title} />
	</Field>
	<Field label="Purpose (one sentence)" inputId="purpose">
		<TextInput id="purpose" label="Purpose" placeholder="e.g. Plan the next sprint" bind:value={m.purpose} />
	</Field>
	<Field label="Long description" inputId="longDescription">
		<TextAreaInput id="longDescription" label="Long description" rows={4} placeholder="Optional background or context for attendees." bind:value={m.longDescription} />
	</Field>
	<Field label="Category" inputId="category">
		<Select id="category" label="Category" bind:value={m.category}>
			<option value="">Select…</option>
			<option value="stand-up">Stand-up</option>
			<option value="review">Review</option>
			<option value="planning">Planning</option>
			<option value="training">Training</option>
			<option value="one-to-one">One-to-one</option>
			<option value="interview">Interview</option>
			<option value="governance">Governance</option>
			<option value="social">Social</option>
			<option value="other">Other</option>
		</Select>
	</Field>
	<Field label="Visibility" inputId="visibility">
		<Select id="visibility" label="Visibility" bind:value={m.visibility}>
			<option value="">Select…</option>
			<option value="public">Public</option>
			<option value="internal">Internal</option>
			<option value="confidential">Confidential</option>
			<option value="private">Private</option>
		</Select>
	</Field>
</Fieldset>
