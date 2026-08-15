<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const m = assessment.data.mental;
</script>

<Fieldset legend="Step 7 of 10 — Mental health &amp; behaviour">
	<p class="hint">Mood, behaviour that challenges and its triggers, and recent life events.</p>

	<Field label="Mental health / mood" inputId="mental-mentalHealthStatus">
		<Select
			id="mental-mentalHealthStatus"
			label="Mental health / mood"
			bind:value={m.mentalHealthStatus}
		>
			<option value="">— Select —</option>
			<option value="ok">OK / no concern</option>
			<option value="concern">Concern</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field label="Behaviour that challenges" inputId="mental-behaviourStatus">
		<Select
			id="mental-behaviourStatus"
			label="Behaviour that challenges"
			bind:value={m.behaviourStatus}
		>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="challenging">Behaviour that challenges</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field
		label="Behaviour triggers and recent life events"
		inputId="mental-behaviourTriggers"
	>
		<TextAreaInput
			id="mental-behaviourTriggers"
			label="Behaviour triggers and recent life events"
			rows={3}
			placeholder="Known triggers, and any recent life events (bereavement, moves, changes)."
			bind:value={m.behaviourTriggers}
		/>
	</Field>
</Fieldset>
