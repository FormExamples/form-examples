<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="5. Cardiac Safety Screen">
	<p class="hint">
		Safety factors that determine whether the stress test can proceed as requested. Recent acute
		coronary syndrome and severe symptomatic aortic stenosis contraindicate exercise testing.
	</p>

	<Field label="Safety factors">
		<CheckboxGroup label="Safety factors">
			<label><CheckboxInput label="Known coronary artery disease" bind:checked={d.safety.knownCoronaryArteryDisease} /> Known coronary artery disease</label>
			<label><CheckboxInput label="Recent acute coronary syndrome" bind:checked={d.safety.recentAcuteCoronarySyndrome} /> Recent acute coronary syndrome</label>
			<label><CheckboxInput label="Uncontrolled hypertension" bind:checked={d.safety.uncontrolledHypertension} /> Uncontrolled hypertension</label>
			<label><CheckboxInput label="Taking a beta-blocker" bind:checked={d.safety.betaBlocker} /> Taking a beta-blocker</label>
		</CheckboxGroup>
	</Field>

	<Field label="Aortic stenosis severity" inputId="aorticStenosis">
		<Select id="aorticStenosis" label="Aortic stenosis severity" bind:value={d.safety.aorticStenosis}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe (symptomatic)</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
