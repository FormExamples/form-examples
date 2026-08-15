<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const a = assessment.data.appearance;
</script>

<Fieldset legend="Step 3 of 10 — Appearance and behaviour">
	<p class="hint">ASEPTIC domain A — grooming, engagement, and psychomotor activity.</p>

	<Field label="Grooming and dress" inputId="appearance-appearanceGrooming">
		<Select
			id="appearance-appearanceGrooming"
			label="Grooming and dress"
			bind:value={a.appearanceGrooming}
		>
			<option value="">— Select —</option>
			<option value="well-kempt">Well-kempt</option>
			<option value="dishevelled">Dishevelled</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Eye contact" inputId="appearance-appearanceEyeContact">
		<Select
			id="appearance-appearanceEyeContact"
			label="Eye contact"
			bind:value={a.appearanceEyeContact}
		>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="reduced">Reduced</option>
			<option value="intense">Intense</option>
			<option value="avoidant">Avoidant</option>
		</Select>
	</Field>

	<Field label="Rapport" inputId="appearance-appearanceRapport">
		<Select id="appearance-appearanceRapport" label="Rapport" bind:value={a.appearanceRapport}>
			<option value="">— Select —</option>
			<option value="good">Good</option>
			<option value="guarded">Guarded</option>
			<option value="hostile">Hostile</option>
			<option value="withdrawn">Withdrawn</option>
		</Select>
	</Field>

	<Field
		label="Psychomotor activity"
		description="Agitation raises a low-priority safety flag."
		inputId="appearance-appearancePsychomotor"
	>
		<Select
			id="appearance-appearancePsychomotor"
			label="Psychomotor activity"
			bind:value={a.appearancePsychomotor}
		>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="agitation">Agitation</option>
			<option value="retardation">Retardation</option>
		</Select>
	</Field>

	<Field label="Abnormal movements" inputId="appearance-appearanceAbnormalMovements">
		<TextInput
			id="appearance-appearanceAbnormalMovements"
			label="Abnormal movements"
			placeholder="e.g. resting tremor, orofacial dyskinesia"
			bind:value={a.appearanceAbnormalMovements}
		/>
	</Field>

	<Field label="Notes" inputId="appearance-appearanceNotes">
		<TextAreaInput
			id="appearance-appearanceNotes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes on appearance and behaviour."
			bind:value={a.appearanceNotes}
		/>
	</Field>
</Fieldset>
