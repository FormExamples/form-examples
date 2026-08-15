<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const s = request.data.safety;
</script>

<Fieldset legend="6. Safety">
	<p class="hint">
		Factors affecting needle EMG and electrical stimulation — drive the procedural-risk axis.
	</p>

	<Field label="Safety factors">
		<CheckboxGroup label="Safety factors">
			<label><CheckboxInput label="Diabetes" bind:checked={s.diabetes} /> Diabetes</label>
			<label><CheckboxInput label="Taking anticoagulant" bind:checked={s.takingAnticoagulant} /> Taking anticoagulant</label>
			<label><CheckboxInput label="Pacemaker or ICD" bind:checked={s.pacemakerOrIcd} /> Pacemaker or ICD</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
