<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const cm = assessment.data.cardiometabolic;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 8 — Cardiometabolic measurements">
	<p class="hint">Diabetes status, lipids, and blood pressure.</p>

	<Field label="Diabetes status" inputId="cardiometabolic-diabetesStatus">
		<Select id="cardiometabolic-diabetesStatus" label="Diabetes status" bind:value={cm.diabetesStatus}>
			<option value="">— Select —</option>
			<option value="none">No diabetes</option>
			<option value="type1">Type 1 diabetes</option>
			<option value="type2">Type 2 diabetes</option>
		</Select>
	</Field>

	<Field
		label="Total-cholesterol : HDL ratio"
		description="Required input. Obtain from a lipid profile."
		inputId="cardiometabolic-cholesterolHdlRatio"
	>
		<NumberInput
			id="cardiometabolic-cholesterolHdlRatio"
			label="Total-cholesterol : HDL ratio"
			min={1}
			max={12}
			step={0.1}
			bind:value={cm.cholesterolHdlRatio}
		/>
	</Field>

	<Field
		label="Systolic blood pressure (mmHg)"
		description="Required input."
		inputId="cardiometabolic-systolicBloodPressure"
	>
		<NumberInput
			id="cardiometabolic-systolicBloodPressure"
			label="Systolic blood pressure (mmHg)"
			min={70}
			max={250}
			step={1}
			bind:value={cm.systolicBloodPressure}
		/>
	</Field>

	<Field
		label="Systolic BP variability — standard deviation (mmHg)"
		description="Optional. Visit-to-visit standard deviation of systolic readings."
		inputId="cardiometabolic-systolicBloodPressureSd"
	>
		<NumberInput
			id="cardiometabolic-systolicBloodPressureSd"
			label="Systolic BP variability standard deviation (mmHg)"
			min={0}
			max={40}
			step={0.1}
			bind:value={cm.systolicBloodPressureSd}
		/>
	</Field>

	<Field label="On blood-pressure treatment?">
		<RadioGroup label="On blood-pressure treatment?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiometabolic-onBloodPressureTreatment"
						value={opt.value}
						bind:group={cm.onBloodPressureTreatment}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
