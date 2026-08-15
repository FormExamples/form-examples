<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="4. Symptoms and Exercise Capacity">
	<p class="hint">Presenting symptoms, ability to exercise, and resting ECG findings.</p>

	<Field label="Symptoms present">
		<CheckboxGroup label="Symptoms present">
			<label><CheckboxInput label="Chest pain" bind:checked={d.symptoms.symptomChestPain} /> Chest pain</label>
			<label><CheckboxInput label="Breathlessness (dyspnoea)" bind:checked={d.symptoms.symptomBreathlessness} /> Breathlessness (dyspnoea)</label>
			<label><CheckboxInput label="Palpitations" bind:checked={d.symptoms.symptomPalpitations} /> Palpitations</label>
		</CheckboxGroup>
	</Field>

	<Field label="Exercise capacity" description="Exercise tests (treadmill ECG, exercise stress echo) require the patient to be able to exercise.">
		<CheckboxGroup label="Exercise capacity">
			<label><CheckboxInput label="Able to exercise" bind:checked={d.symptoms.ableToExercise} /> Able to exercise</label>
		</CheckboxGroup>
	</Field>

	<Field label="Resting ECG findings" inputId="restingEcgFindings">
		<TextAreaInput
			id="restingEcgFindings"
			label="Resting ECG findings"
			rows={2}
			placeholder="e.g. LBBB, paced rhythm, resting ST changes — may affect test selection."
			bind:value={d.symptoms.restingEcgFindings}
		/>
	</Field>
</Fieldset>
