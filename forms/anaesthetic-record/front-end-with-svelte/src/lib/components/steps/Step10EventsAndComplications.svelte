<script lang="ts">
	import { assessment, createDefaultEvent } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const d = $state(assessment.data);

	function addEvent() {
		d.events.push(createDefaultEvent());
	}
	function removeEvent(i: number) {
		d.events.splice(i, 1);
	}
</script>

<Fieldset legend="Step 10 of 12 — Events & complications">
	<p class="hint">
		One row per intra-operative event, with time and management. An anaphylaxis event raises a
		high-priority safety flag.
	</p>

	{#if d.events.length === 0}
		<p class="hint">No events added. Add a row for each intra-operative event or complication.</p>
	{/if}

	{#each d.events as event, i (i)}
		<div class="repeating-row">
			<div class="repeating-row-header">
				<h4 class="repeating-row-title">Event {i + 1}</h4>
				<Button data-variant="danger" label={`Remove event ${i + 1}`} onclick={() => removeEvent(i)}>
					Remove
				</Button>
			</div>

			<Field label="Event type" inputId={`events-${i}-eventType`}>
				<Select id={`events-${i}-eventType`} label="Event type" bind:value={event.eventType}>
					<option value="">— Select —</option>
					<option value="desaturation">Desaturation</option>
					<option value="hypotension">Hypotension</option>
					<option value="arrhythmia">Arrhythmia</option>
					<option value="laryngospasm">Laryngospasm</option>
					<option value="bronchospasm">Bronchospasm</option>
					<option value="anaphylaxis">Anaphylaxis</option>
					<option value="difficult-airway">Difficult airway</option>
					<option value="awareness">Awareness</option>
					<option value="other">Other</option>
				</Select>
			</Field>

			<Field label="Time occurred" inputId={`events-${i}-occurredAt`}>
				<TextInput
					id={`events-${i}-occurredAt`}
					label="Time occurred"
					type="datetime-local"
					class="date-input"
					bind:value={event.occurredAt}
				/>
			</Field>

			<Field label="Management" inputId={`events-${i}-management`}>
				<TextInput
					id={`events-${i}-management`}
					label="Management"
					placeholder="e.g. IV fluids and metaraminol; resolved"
					bind:value={event.management}
				/>
			</Field>
		</div>
	{/each}

	<Button data-variant="secondary" onclick={addEvent}>+ Add event</Button>
</Fieldset>
