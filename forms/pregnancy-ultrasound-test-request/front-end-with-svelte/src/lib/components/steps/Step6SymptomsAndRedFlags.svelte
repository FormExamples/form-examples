<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="6. Symptoms and Red Flags">
	<p class="hint">Red flags auto-escalate the triage tier regardless of the other axes.</p>

	<Field label="Vaginal bleeding" inputId="vaginalBleeding">
		<Select id="vaginalBleeding" label="Vaginal bleeding" bind:value={d.symptoms.vaginalBleeding}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="light">Light</option>
			<option value="moderate">Moderate</option>
			<option value="heavy">Heavy</option>
		</Select>
	</Field>

	<Field label="Abdominal pain" inputId="abdominalPain">
		<Select id="abdominalPain" label="Abdominal pain" bind:value={d.symptoms.abdominalPain}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Red flags">
		<CheckboxGroup label="Red flags">
			<label
				><CheckboxInput
					label="Reduced fetal movements"
					bind:checked={d.symptoms.reducedFetalMovements}
				/> Reduced fetal movements</label
			>
			<label
				><CheckboxInput
					label="Suspected ectopic pregnancy"
					bind:checked={d.symptoms.suspectedEctopic}
				/> Suspected ectopic pregnancy</label
			>
			<label
				><CheckboxInput
					label="Haemodynamically unstable"
					bind:checked={d.symptoms.haemodynamicallyUnstable}
				/> Haemodynamically unstable</label
			>
		</CheckboxGroup>
	</Field>
</Fieldset>
