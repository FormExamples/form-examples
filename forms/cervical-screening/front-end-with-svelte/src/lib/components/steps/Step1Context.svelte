<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 9 — Encounter context">
	<p class="hint">Who took the sample, in what role and setting, and when.</p>

	<Field label="Sample-taker name" required inputId="context-sampleTakerName">
		<TextInput
			id="context-sampleTakerName"
			label="Sample-taker name"
			placeholder="e.g. A. Okoro"
			required
			bind:value={c.sampleTakerName}
		/>
	</Field>

	<Field label="Sample-taker role" required inputId="context-sampleTakerRole">
		<Select
			id="context-sampleTakerRole"
			label="Sample-taker role"
			required
			bind:value={c.sampleTakerRole}
		>
			<option value="">— Select —</option>
			<option value="practice-nurse">Practice nurse</option>
			<option value="gp">GP</option>
			<option value="smear-taker">Trained smear-taker</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="general-practice">General practice</option>
			<option value="sexual-health">Sexual &amp; reproductive health</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of sample" inputId="context-sampleTakenAt">
		<TextInput
			id="context-sampleTakenAt"
			label="Date and time of sample"
			type="datetime-local"
			class="date-input"
			bind:value={c.sampleTakenAt}
		/>
	</Field>
</Fieldset>
