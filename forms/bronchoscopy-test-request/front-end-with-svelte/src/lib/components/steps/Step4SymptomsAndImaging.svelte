<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data.symptoms;
</script>

<Fieldset legend="4. Symptoms and Imaging">
	<p class="hint">
		Respiratory symptoms drive the cancer-pathway urgency axis. Record any supporting imaging.
	</p>

	<Field label="Symptoms present">
		<CheckboxGroup label="Symptoms present">
			<label>
				<CheckboxInput label="Haemoptysis" bind:checked={d.symptomHaemoptysis} /> Haemoptysis
			</label>
			<label><CheckboxInput label="Cough" bind:checked={d.symptomCough} /> Cough</label>
			<label>
				<CheckboxInput label="Breathlessness" bind:checked={d.symptomBreathlessness} /> Breathlessness
			</label>
			<label>
				<CheckboxInput label="Weight loss" bind:checked={d.symptomWeightLoss} /> Unexplained weight loss
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.symptomHaemoptysis}
		<Field
			label="Haemoptysis severity"
			inputId="haemoptysisSeverity"
			description="Massive haemoptysis auto-escalates triage to emergency."
		>
			<Select id="haemoptysisSeverity" label="Haemoptysis severity" bind:value={d.haemoptysisSeverity}>
				<option value="">Select…</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="massive">Massive</option>
			</Select>
		</Field>

		{#if d.haemoptysisSeverity === 'massive'}
			<Alert type="error" heading="Massive haemoptysis — emergency">
				<p>
					Massive haemoptysis is a life-threatening airway emergency and auto-escalates triage to
					emergency. Arrange immediate assessment with airway protection.
				</p>
			</Alert>
		{/if}
	{/if}

	<Field label="Imaging findings" inputId="imagingFindings" description="Recent chest x-ray / CT findings.">
		<TextAreaInput
			id="imagingFindings"
			label="Imaging findings"
			rows={3}
			placeholder="e.g. CT chest: 3.5 cm right hilar mass; subcarinal nodes…"
			bind:value={d.imagingFindings}
		/>
	</Field>
</Fieldset>
