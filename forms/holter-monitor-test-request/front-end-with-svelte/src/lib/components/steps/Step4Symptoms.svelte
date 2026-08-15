<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const s = request.data.symptoms;
</script>

<Fieldset legend="4. Symptoms">
	<p class="hint">Presenting symptoms and how often they occur (drives monitor-duration matching).</p>

	<Field label="Symptoms present">
		<CheckboxGroup label="Symptoms present">
			<label><CheckboxInput label="Palpitations" bind:checked={s.palpitations} /> Palpitations</label>
			<label><CheckboxInput label="Syncope / blackout" bind:checked={s.syncope} /> Syncope / blackout</label>
			<label><CheckboxInput label="Presyncope / near-syncope" bind:checked={s.presyncope} /> Presyncope / near-syncope</label>
			<label><CheckboxInput label="Breathlessness" bind:checked={s.breathlessness} /> Breathlessness</label>
		</CheckboxGroup>
	</Field>

	<Field label="Symptom frequency" inputId="symptomFrequency" description="How often symptoms occur — determines the recommended monitor duration.">
		<Select id="symptomFrequency" label="Symptom frequency" bind:value={s.symptomFrequency}>
			<option value="">Select…</option>
			<option value="daily">Daily / near-daily</option>
			<option value="weekly">Weekly</option>
			<option value="monthly">Monthly</option>
			<option value="rare">Rare (&lt; monthly)</option>
		</Select>
	</Field>
</Fieldset>
