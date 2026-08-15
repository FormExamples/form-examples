<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Manometry & Appearance">
	<p class="hint">The manometry opening pressure and the macroscopic CSF appearance.</p>

	<Field
		label="Opening pressure (cmH₂O)"
		inputId="openingPressureCmh2o"
		description="Normal adult range approximately 6–25 cmH₂O when relaxed and laterally recumbent."
	>
		<NumberInput
			id="openingPressureCmh2o"
			label="Opening pressure (cmH₂O)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.openingPressureCmh2o}
		/>
	</Field>

	<Field label="CSF appearance" inputId="csfAppearance" required>
		<Select id="csfAppearance" label="CSF appearance" bind:value={d.csfAppearance} required>
			<option value="">Select…</option>
			<option value="clear">Clear</option>
			<option value="cloudy">Cloudy</option>
			<option value="turbid">Turbid</option>
			<option value="blood-stained">Blood-stained</option>
			<option value="xanthochromic">Xanthochromic</option>
		</Select>
	</Field>
</Fieldset>
