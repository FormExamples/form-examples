<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const s = request.data.symptoms;
</script>

<Fieldset legend="5. Symptoms">
	<p class="hint">
		Presenting symptoms and their duration. Rapidly progressive weakness expedites triage.
	</p>

	<Field label="Reported symptoms">
		<CheckboxGroup label="Reported symptoms">
			<label><CheckboxInput label="Numbness" bind:checked={s.symptomNumbness} /> Numbness</label>
			<label><CheckboxInput label="Weakness" bind:checked={s.symptomWeakness} /> Weakness</label>
			<label><CheckboxInput label="Pain" bind:checked={s.symptomPain} /> Pain</label>
			<label><CheckboxInput label="Tingling / paraesthesia" bind:checked={s.symptomTingling} /> Tingling / paraesthesia</label>
		</CheckboxGroup>
	</Field>

	<Field label="Symptom duration" inputId="symptomDuration">
		<Select id="symptomDuration" label="Symptom duration" bind:value={s.symptomDuration}>
			<option value="">Select…</option>
			<option value="less-than-6-weeks">Less than 6 weeks</option>
			<option value="6-weeks-to-3-months">6 weeks to 3 months</option>
			<option value="3-to-12-months">3 to 12 months</option>
			<option value="over-12-months">Over 12 months</option>
		</Select>
	</Field>
</Fieldset>
