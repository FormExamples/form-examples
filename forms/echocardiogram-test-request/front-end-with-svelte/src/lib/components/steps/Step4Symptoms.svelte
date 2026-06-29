<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.symptoms;
</script>

<Fieldset legend="4. Symptoms">
	<p class="hint">Presenting symptoms and functional class. Syncope and NYHA class drive the urgency and priority axes.</p>

	<Field label="Symptoms present">
		<CheckboxGroup label="Symptoms present">
			<label><CheckboxInput label="Breathlessness" bind:checked={d.breathlessness} /> Breathlessness</label>
			<label><CheckboxInput label="Chest pain" bind:checked={d.chestPain} /> Chest pain</label>
			<label><CheckboxInput label="Palpitations" bind:checked={d.palpitations} /> Palpitations</label>
			<label><CheckboxInput label="Syncope / blackout" bind:checked={d.syncope} /> Syncope / blackout</label>
			<label><CheckboxInput label="Peripheral oedema" bind:checked={d.oedema} /> Peripheral oedema</label>
		</CheckboxGroup>
	</Field>

	<Field
		label="NYHA functional class"
		inputId="nyhaClass"
		description="New York Heart Association class for breathlessness."
	>
		<Select id="nyhaClass" label="NYHA functional class" bind:value={d.nyhaClass}>
			<option value="">Select…</option>
			<option value="i">Class I — no limitation</option>
			<option value="ii">Class II — slight limitation</option>
			<option value="iii">Class III — marked limitation</option>
			<option value="iv">Class IV — symptoms at rest</option>
		</Select>
	</Field>
</Fieldset>
