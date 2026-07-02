<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const t = assessment.data.thought;
</script>

<Fieldset legend="Step 7 of 10 — Thought (form and content)">
	<p class="hint">ASEPTIC domain T — thought form, delusions, and risk-critical ideation.</p>

	<Field label="Thought form" inputId="thought-thoughtForm">
		<Select id="thought-thoughtForm" label="Thought form" bind:value={t.thoughtForm}>
			<option value="">— Select —</option>
			<option value="linear">Linear</option>
			<option value="circumstantial">Circumstantial</option>
			<option value="tangential">Tangential</option>
			<option value="flight-of-ideas">Flight of ideas</option>
			<option value="thought-block">Thought block</option>
			<option value="loosening">Loosening of associations</option>
		</Select>
	</Field>

	<Field
		label="Delusional content"
		description="Any value other than none raises a delusional-content flag."
		inputId="thought-delusions"
	>
		<Select id="thought-delusions" label="Delusional content" bind:value={t.delusions}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="persecutory">Persecutory</option>
			<option value="grandiose">Grandiose</option>
			<option value="reference">Reference</option>
			<option value="nihilistic">Nihilistic</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Obsessions" inputId="thought-obsessions">
		<Select id="thought-obsessions" label="Obsessions" bind:value={t.obsessions}>
			<option value="">— Select —</option>
			<option value="present">Present</option>
			<option value="absent">Absent</option>
		</Select>
	</Field>

	<Field
		label="Suicidal ideation"
		description="Active ideation raises a high-priority flag; passive raises a moderate flag."
		inputId="thought-suicidalIdeation"
	>
		<Select id="thought-suicidalIdeation" label="Suicidal ideation" bind:value={t.suicidalIdeation}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="passive">Passive</option>
			<option value="active-no-plan">Active — no plan</option>
			<option value="active-with-plan">Active — with plan</option>
		</Select>
	</Field>

	<Field
		label="Homicidal ideation"
		description="Thoughts or intent raise a high-priority flag."
		inputId="thought-homicidalIdeation"
	>
		<Select
			id="thought-homicidalIdeation"
			label="Homicidal ideation"
			bind:value={t.homicidalIdeation}
		>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="thoughts">Thoughts of harming others</option>
			<option value="intent">Intent to harm others</option>
		</Select>
	</Field>

	<Field
		label="Self-harm"
		description="Recent acts raise a high-priority flag; thoughts raise a moderate flag."
		inputId="thought-selfHarmThoughts"
	>
		<Select id="thought-selfHarmThoughts" label="Self-harm" bind:value={t.selfHarmThoughts}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="thoughts">Thoughts of self-harm</option>
			<option value="recent-acts">Recent acts of self-harm</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="thought-thoughtNotes">
		<TextAreaInput
			id="thought-thoughtNotes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes on thought form and content."
			bind:value={t.thoughtNotes}
		/>
	</Field>
</Fieldset>
