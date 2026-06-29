<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data;
</script>

<Fieldset legend="4. Fracture-Risk Factors">
	<p class="hint">FRAX inputs and high-acuity factors. These drive the appropriateness and triage axes.</p>

	<Field
		label="FRAX 10-year major-fracture probability (%)"
		inputId="fraxMajorFracturePercent"
		description="At or above the NOGG intervention threshold strongly supports DEXA; a very high value expedites triage."
	>
		<NumberInput
			id="fraxMajorFracturePercent"
			label="FRAX 10-year major-fracture probability (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.riskFactors.fraxMajorFracturePercent}
		/>
	</Field>

	<Field label="High-acuity factors">
		<CheckboxGroup label="High-acuity factors">
			<label
				><CheckboxInput
					label="Previous fragility fracture"
					bind:checked={d.riskFactors.previousFragilityFracture}
				/> Previous fragility fracture</label
			>
			<label
				><CheckboxInput
					label="Long-term high-dose steroids"
					bind:checked={d.riskFactors.longTermSteroids}
				/> Long-term high-dose steroids</label
			>
			<label
				><CheckboxInput
					label="Parental hip fracture"
					bind:checked={d.riskFactors.parentalHipFracture}
				/> Parental hip fracture</label
			>
		</CheckboxGroup>
	</Field>

	<Field label="Menopause status" inputId="menopauseStatus">
		<Select id="menopauseStatus" label="Menopause status" bind:value={d.riskFactors.menopauseStatus}>
			<option value="">Select…</option>
			<option value="pre">Pre-menopausal</option>
			<option value="peri">Peri-menopausal</option>
			<option value="post">Post-menopausal</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Weight (kg)" inputId="weightKg" description="Low body weight is a fracture-risk factor.">
		<NumberInput
			id="weightKg"
			label="Weight (kg)"
			min={0}
			max={400}
			step={0.1}
			bind:value={d.riskFactors.weightKg}
		/>
	</Field>
</Fieldset>
