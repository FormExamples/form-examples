<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Measurements">
	<p class="hint">Maximum stenosis and whether an intervention was performed.</p>

	<Field
		label="Maximum stenosis (%)"
		inputId="maxStenosisPercent"
		description="Maximum arterial luminal stenosis (0–100), e.g. NASCET-style diameter reduction."
	>
		<NumberInput
			id="maxStenosisPercent"
			label="Maximum stenosis (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.maxStenosisPercent}
		/>
	</Field>

	<Field label="Intervention performed">
		<CheckboxGroup label="Intervention performed">
			<label>
				<CheckboxInput
					label="Intervention performed during the study (angioplasty, stent, embolisation)"
					bind:checked={d.interventionPerformed}
				/> Intervention performed during the study (angioplasty, stent, embolisation)
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
