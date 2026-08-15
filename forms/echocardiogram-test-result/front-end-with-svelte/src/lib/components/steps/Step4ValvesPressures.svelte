<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { hasSevereValveDisease } from '#lib/engine/utils.js';

	const d = resultStore.data;

	const severeValve = $derived(hasSevereValveDisease(d));
</script>

<Fieldset legend="4. Valves & Pressures">
	<p class="hint">Valvular stenosis and regurgitation grades, and estimated pulmonary pressure.</p>

	<Field label="Aortic stenosis" inputId="aorticStenosis">
		<Select id="aorticStenosis" label="Aortic stenosis" bind:value={d.aorticStenosis}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Aortic regurgitation" inputId="aorticRegurgitation">
		<Select id="aorticRegurgitation" label="Aortic regurgitation" bind:value={d.aorticRegurgitation}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Mitral stenosis" inputId="mitralStenosis">
		<Select id="mitralStenosis" label="Mitral stenosis" bind:value={d.mitralStenosis}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Mitral regurgitation" inputId="mitralRegurgitation">
		<Select id="mitralRegurgitation" label="Mitral regurgitation" bind:value={d.mitralRegurgitation}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field
		label="Pulmonary artery systolic pressure — PASP (mmHg)"
		inputId="pulmonaryArterySystolicPressureMmhg"
		description="Estimated pulmonary artery systolic pressure."
	>
		<NumberInput
			id="pulmonaryArterySystolicPressureMmhg"
			label="Pulmonary artery systolic pressure — PASP (mmHg)"
			min={0}
			max={200}
			step={0.1}
			bind:value={d.pulmonaryArterySystolicPressureMmhg}
		/>
	</Field>

	{#if severeValve}
		<Alert type="error" heading="Severe valve disease selected">
			<p>
				Severe valvular disease auto-escalates the follow-up urgency to a critical alert. Ensure the
				result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
