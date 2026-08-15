<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { requestStore } from '#lib/stores/result.svelte.js';

	const d = requestStore.data;
</script>

<Fieldset legend="4. Functional Difficulties">
	<p class="hint">
		The functional difficulties the worker experiences at work, mapped to the ACAS functional areas,
		plus the tasks affected and the strengths adjustments can support.
	</p>

	<Field label="Functional difficulties">
		<CheckboxGroup label="Functional difficulties">
			<label><CheckboxInput label="Concentration / focus" bind:checked={d.difficultyConcentration} /> Concentration / focus</label>
			<label><CheckboxInput label="Reading / written communication" bind:checked={d.difficultyWrittenCommunication} /> Reading / written communication</label>
			<label><CheckboxInput label="Organisation / time management" bind:checked={d.difficultyOrganisationTime} /> Organisation / time management</label>
			<label><CheckboxInput label="Sensory overload" bind:checked={d.difficultySensoryOverload} /> Sensory overload</label>
			<label><CheckboxInput label="Balance / coordination" bind:checked={d.difficultyBalanceCoordination} /> Balance / coordination</label>
			<label><CheckboxInput label="Social communication" bind:checked={d.difficultySocialCommunication} /> Social communication</label>
			<label><CheckboxInput label="Working memory / recall" bind:checked={d.difficultyMemory} /> Working memory / recall</label>
			<label><CheckboxInput label="Fatigue / burnout / wellbeing" bind:checked={d.difficultyBurnoutWellbeing} /> Fatigue / burnout / wellbeing</label>
		</CheckboxGroup>
	</Field>

	<Field
		label="Tasks and situations affected"
		inputId="tasksSituationsAffected"
		description="Where at work the difficulties cause a substantial disadvantage."
	>
		<TextAreaInput
			id="tasksSituationsAffected"
			label="Tasks and situations affected"
			rows={3}
			placeholder="e.g. Open-plan office is distracting during focused work; long written briefs are hard to process…"
			bind:value={d.tasksSituationsAffected}
		/>
	</Field>

	<Field
		label="Worker strengths"
		inputId="workerStrengths"
		description="Strengths that adjustments can help the worker make the most of (ACAS: strength utilisation)."
	>
		<TextAreaInput
			id="workerStrengths"
			label="Worker strengths"
			rows={3}
			placeholder="e.g. Strong pattern recognition, creative problem solving, deep focus on detailed work…"
			bind:value={d.workerStrengths}
		/>
	</Field>
</Fieldset>
