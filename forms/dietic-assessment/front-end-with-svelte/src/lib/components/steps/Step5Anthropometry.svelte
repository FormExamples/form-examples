<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
	const result = $derived(assessmentStore.result);
</script>

<Fieldset legend="5. Anthropometry and Physical Measurements">
	<p class="hint">Height, weight, and body mass index, with a mid-upper-arm-circumference alternative when being weighed causes distress.</p>

	<p class="hint">Being weighed distresses some patients. Choose “Declined by the patient” for the measurement method and record a mid-upper-arm circumference instead; the MUST body mass index component is then estimated and the report says so. A declined weight never blocks the assessment.</p>
	<Field label="Measurement method" inputId="anthropometry-measurementMethod" required>
		<Select id="anthropometry-measurementMethod" label="Measurement method" bind:value={d.anthropometry.measurementMethod} required>
			<option value="">— Select —</option>
			{#each OPTIONS.measurementMethod as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Height (cm)" inputId="anthropometry-heightAsCm">
		<NumberInput id="anthropometry-heightAsCm" label="Height (cm)" min={50} max={250} step="0.1" bind:value={d.anthropometry.heightAsCm} />
	</Field>
	<Field label="Weight (kg)" inputId="anthropometry-weightAsKg">
		<NumberInput id="anthropometry-weightAsKg" label="Weight (kg)" min={15} max={400} step="0.1" bind:value={d.anthropometry.weightAsKg} />
	</Field>
	<Field label="Body mass index" inputId="anthropometry-bmi" description="Computed from height and weight, after any oedema adjustment.">
		<TextInput
			id="anthropometry-bmi"
			label="Body mass index"
			value={result.bmi === null ? "—" : `${result.bmi} kg/m²`}
			readonly
		/>
	</Field>
	<Field label="Unplanned weight loss" inputId="anthropometry-weightLoss" description="Computed against the usual weight, or the 6-month or 3-month weight.">
		<TextInput
			id="anthropometry-weightLoss"
			label="Unplanned weight loss"
			value={result.weightLossPercent === null ? "—" : `${result.weightLossPercent}%`}
			readonly
		/>
	</Field>
	<Field label="Mid-upper-arm circumference (cm)" inputId="anthropometry-midUpperArmCircumferenceAsCm" description="Below 23.5 suggests a body mass index below 20; above 32.0 suggests above 30.">
		<NumberInput id="anthropometry-midUpperArmCircumferenceAsCm" label="Mid-upper-arm circumference (cm)" min={8} max={70} step="0.1" bind:value={d.anthropometry.midUpperArmCircumferenceAsCm} />
	</Field>
	<Field label="Calf circumference (cm)" inputId="anthropometry-calfCircumferenceAsCm">
		<NumberInput id="anthropometry-calfCircumferenceAsCm" label="Calf circumference (cm)" min={10} max={80} step="0.1" bind:value={d.anthropometry.calfCircumferenceAsCm} />
	</Field>
	<Field label="Waist circumference (cm)" inputId="anthropometry-waistAsCm">
		<NumberInput id="anthropometry-waistAsCm" label="Waist circumference (cm)" min={30} max={250} step="0.1" bind:value={d.anthropometry.waistAsCm} />
	</Field>
	<Field label="Usual weight (kg)" inputId="anthropometry-usualWeightAsKg">
		<NumberInput id="anthropometry-usualWeightAsKg" label="Usual weight (kg)" min={15} max={400} step="0.1" bind:value={d.anthropometry.usualWeightAsKg} />
	</Field>
	<Field label="Weight trend" inputId="anthropometry-weightTrend">
		<Select id="anthropometry-weightTrend" label="Weight trend" bind:value={d.anthropometry.weightTrend}>
			<option value="">— Select —</option>
			{#each OPTIONS.weightTrend as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Weight 3 months ago (kg)" inputId="anthropometry-weight3MonthsAgoAsKg">
		<NumberInput id="anthropometry-weight3MonthsAgoAsKg" label="Weight 3 months ago (kg)" min={15} max={400} step="0.1" bind:value={d.anthropometry.weight3MonthsAgoAsKg} />
	</Field>
	<Field label="Weight 6 months ago (kg)" inputId="anthropometry-weight6MonthsAgoAsKg">
		<NumberInput id="anthropometry-weight6MonthsAgoAsKg" label="Weight 6 months ago (kg)" min={15} max={400} step="0.1" bind:value={d.anthropometry.weight6MonthsAgoAsKg} />
	</Field>
	<Field label="Was the weight loss intentional" inputId="anthropometry-weightLossIsIntentional" description="Only unplanned loss scores in MUST.">
		<Select id="anthropometry-weightLossIsIntentional" label="Was the weight loss intentional" bind:value={d.anthropometry.weightLossIsIntentional}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Clothes or jewellery looser" inputId="anthropometry-clothesOrJewelleryLooser" description="The MUST subjective criterion, used when no baseline weight is available.">
		<Select id="anthropometry-clothesOrJewelleryLooser" label="Clothes or jewellery looser" bind:value={d.anthropometry.clothesOrJewelleryLooser}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Oedema present" inputId="anthropometry-oedemaPresent">
		<Select id="anthropometry-oedemaPresent" label="Oedema present" bind:value={d.anthropometry.oedemaPresent}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Oedema weight adjustment (kg)" inputId="anthropometry-oedemaAdjustmentKg">
		<NumberInput id="anthropometry-oedemaAdjustmentKg" label="Oedema weight adjustment (kg)" min={0} max={30} step="0.1" bind:value={d.anthropometry.oedemaAdjustmentKg} />
	</Field>
	<Field label="Ascites present" inputId="anthropometry-ascitesPresent">
		<Select id="anthropometry-ascitesPresent" label="Ascites present" bind:value={d.anthropometry.ascitesPresent}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Amputation present" inputId="anthropometry-amputationPresent">
		<Select id="anthropometry-amputationPresent" label="Amputation present" bind:value={d.anthropometry.amputationPresent}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Amputation adjustment (% of body weight)" inputId="anthropometry-amputationAdjustmentPercent">
		<NumberInput id="anthropometry-amputationAdjustmentPercent" label="Amputation adjustment (% of body weight)" min={0} max={50} step="0.1" bind:value={d.anthropometry.amputationAdjustmentPercent} />
	</Field>
	<Field label="Measurement notes" inputId="anthropometry-anthropometryNotes">
		<TextAreaInput id="anthropometry-anthropometryNotes" label="Measurement notes" rows={2}
			placeholder="For example, why weighing was declined." bind:value={d.anthropometry.anthropometryNotes} />
	</Field>
</Fieldset>
