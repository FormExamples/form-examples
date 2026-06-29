<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.symptoms;
</script>

<Fieldset legend="4. Symptoms">
	<p class="hint">Respiratory symptoms relevant to the requested test.</p>

	<Field label="Respiratory symptoms" inputId="symptoms">
		<CheckboxGroup label="Respiratory symptoms">
			<label><CheckboxInput label="Breathlessness" bind:checked={d.breathlessness} /> Breathlessness</label>
			<label><CheckboxInput label="Cough" bind:checked={d.cough} /> Cough</label>
			<label><CheckboxInput label="Wheeze" bind:checked={d.wheeze} /> Wheeze</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
