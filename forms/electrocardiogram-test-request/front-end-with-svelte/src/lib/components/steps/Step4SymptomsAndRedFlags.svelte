<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.symptoms;
</script>

<Fieldset legend="4. Symptoms and Red Flags">
	<p class="hint">
		Presenting symptoms and acute red flags. Suspected ACS or active chest pain escalates the
		request to an emergency, same-hour 12-lead ECG.
	</p>

	<Field label="Symptoms present">
		<CheckboxGroup label="Symptoms present">
			<label><CheckboxInput label="Chest pain" bind:checked={d.symptomChestPain} /> Chest pain</label>
			<label><CheckboxInput label="Palpitations" bind:checked={d.symptomPalpitations} /> Palpitations</label>
			<label><CheckboxInput label="Syncope / blackout" bind:checked={d.symptomSyncope} /> Syncope / blackout</label>
			<label><CheckboxInput label="Breathlessness" bind:checked={d.symptomBreathlessness} /> Breathlessness</label>
			<label><CheckboxInput label="Dizziness" bind:checked={d.symptomDizziness} /> Dizziness</label>
		</CheckboxGroup>
	</Field>

	<Field label="Acuity">
		<CheckboxGroup label="Acuity">
			<label>
				<CheckboxInput label="Currently symptomatic" bind:checked={d.currentlySymptomatic} /> Currently
				symptomatic at the time of request
			</label>
			<label>
				<CheckboxInput label="Suspected acute coronary syndrome" bind:checked={d.suspectedAcs} /> Suspected
				acute coronary syndrome (ACS)
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Known / suspected arrhythmia" inputId="knownArrhythmia" description="Ventricular tachycardia escalates the request to urgent.">
		<Select id="knownArrhythmia" label="Known / suspected arrhythmia" bind:value={d.knownArrhythmia}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="af">Atrial fibrillation</option>
			<option value="svt">Supraventricular tachycardia</option>
			<option value="vt">Ventricular tachycardia</option>
			<option value="heart-block">Heart block</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
