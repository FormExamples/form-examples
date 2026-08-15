<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const k = request.data.cardiac;
</script>

<Fieldset legend="5. Cardiac Context and Red Flags">
	<p class="hint">Known arrhythmia, recent stroke / TIA, and relevant medications.</p>

	<Field label="Known arrhythmia" inputId="knownArrhythmia" description="Any documented or suspected arrhythmia.">
		<Select id="knownArrhythmia" label="Known arrhythmia" bind:value={k.knownArrhythmia}>
			<option value="">None recorded</option>
			<option value="atrial-fibrillation">Atrial fibrillation</option>
			<option value="svt">Supraventricular tachycardia</option>
			<option value="vt">Ventricular tachycardia</option>
			<option value="heart-block">Heart block</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Red flags">
		<CheckboxGroup label="Red flags">
			<label><CheckboxInput label="Recent stroke / TIA" bind:checked={k.recentStrokeTia} /> Recent stroke / TIA</label>
		</CheckboxGroup>
	</Field>

	<Field label="Relevant medications" inputId="relevantMedications">
		<TextAreaInput
			id="relevantMedications"
			label="Relevant medications"
			rows={3}
			placeholder="e.g. beta-blockers, anticoagulants, antiarrhythmics…"
			bind:value={k.relevantMedications}
		/>
	</Field>
</Fieldset>
