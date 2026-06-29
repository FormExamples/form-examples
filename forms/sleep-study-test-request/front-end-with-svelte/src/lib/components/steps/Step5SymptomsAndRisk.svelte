<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const sy = request.data.symptoms;
</script>

<Fieldset legend="5. Symptoms and Risk">
	<p class="hint">
		Occupational driving with sleepiness, and severe sleepiness, auto-escalate the triage tier.
	</p>

	<Field label="Symptoms and risk factors">
		<CheckboxGroup label="Symptoms and risk factors">
			<label>
				<CheckboxInput label="Witnessed apnoeas reported" bind:checked={sy.witnessedApnoeas} /> Witnessed apnoeas reported
			</label>
			<label>
				<CheckboxInput label="Occupational / vocational driver" bind:checked={sy.occupationalDriver} /> Occupational / vocational driver
			</label>
			<label>
				<CheckboxInput label="Established cardiovascular disease" bind:checked={sy.cardiovascularDisease} /> Established cardiovascular disease
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
