<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const e = assessment.data.emotion;
</script>

<Fieldset legend="Step 5 of 10 — Emotion (mood and affect)">
	<p class="hint">
		ASEPTIC domain E — subjective mood, objective mood descriptor, and observed affect.
	</p>

	<Field label="Subjective mood (patient's own words)" inputId="emotion-moodSubjective">
		<TextInput
			id="emotion-moodSubjective"
			label="Subjective mood (patient's own words)"
			placeholder="e.g. &quot;empty and hopeless&quot;"
			bind:value={e.moodSubjective}
		/>
	</Field>

	<Field
		label="Objective mood descriptor"
		description="Low mood without an ideation flag raises a low-priority flag."
		inputId="emotion-moodDescriptor"
	>
		<Select
			id="emotion-moodDescriptor"
			label="Objective mood descriptor"
			bind:value={e.moodDescriptor}
		>
			<option value="">— Select —</option>
			<option value="euthymic">Euthymic</option>
			<option value="low">Low / depressed</option>
			<option value="elevated">Elevated</option>
			<option value="anxious">Anxious</option>
			<option value="irritable">Irritable</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Affect range" inputId="emotion-affectRange">
		<Select id="emotion-affectRange" label="Affect range" bind:value={e.affectRange}>
			<option value="">— Select —</option>
			<option value="full">Full</option>
			<option value="restricted">Restricted</option>
			<option value="blunted">Blunted</option>
			<option value="flat">Flat</option>
		</Select>
	</Field>

	<Field label="Affect congruence" inputId="emotion-affectCongruence">
		<Select id="emotion-affectCongruence" label="Affect congruence" bind:value={e.affectCongruence}>
			<option value="">— Select —</option>
			<option value="congruent">Congruent</option>
			<option value="incongruent">Incongruent</option>
		</Select>
	</Field>

	<Field label="Affect reactivity" inputId="emotion-affectReactivity">
		<Select id="emotion-affectReactivity" label="Affect reactivity" bind:value={e.affectReactivity}>
			<option value="">— Select —</option>
			<option value="reactive">Reactive</option>
			<option value="non-reactive">Non-reactive</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="emotion-emotionNotes">
		<TextAreaInput
			id="emotion-emotionNotes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes on mood and affect."
			bind:value={e.emotionNotes}
		/>
	</Field>
</Fieldset>
