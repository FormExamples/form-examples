<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const fn = assessment.data.functionalNutritional;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Functional and Nutritional">
	<p class="hint">Detailed functional status and nutritional assessment.</p>

	<Field label="ECOG Performance Status (Detailed)" inputId="ecogDetailed">
		<Select id="ecogDetailed" label="ECOG Detailed" bind:value={fn.ecogDetailed}>
			<option value="">-- Select --</option>
			<option value="0">0 - Fully active</option>
			<option value="1">1 - Restricted in physically strenuous activity</option>
			<option value="2">2 - Ambulatory and capable of all self-care</option>
			<option value="3">3 - Capable of only limited self-care</option>
			<option value="4">4 - Completely disabled</option>
		</Select>
	</Field>

	<Field label="Karnofsky Performance Score" description="0 = dead, 100 = normal, no complaints" inputId="karnofsky">
		<NumberInput id="karnofsky" label="Karnofsky" min={0} max={100} step={10} bind:value={fn.karnofskyScore} />
	</Field>

	<Field label="Nutritional Status" inputId="nutritionalStatus">
		<Select id="nutritionalStatus" label="Nutritional Status" bind:value={fn.nutritionalStatus}>
			<option value="">-- Select --</option>
			<option value="well-nourished">Well nourished</option>
			<option value="at-risk">At risk of malnutrition</option>
			<option value="malnourished">Malnourished</option>
		</Select>
	</Field>

	<Field label="Weight Trajectory" inputId="weightTrajectory">
		<Select id="weightTrajectory" label="Weight Trajectory" bind:value={fn.weightTrajectory}>
			<option value="">-- Select --</option>
			<option value="stable">Stable</option>
			<option value="increasing">Increasing</option>
			<option value="decreasing-slowly">Decreasing slowly</option>
			<option value="decreasing-rapidly">Decreasing rapidly</option>
		</Select>
	</Field>

	<Field label="Dietary Intake" inputId="dietaryIntake">
		<Select id="dietaryIntake" label="Dietary Intake" bind:value={fn.dietaryIntake}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="reduced-mildly">Mildly reduced</option>
			<option value="reduced-significantly">Significantly reduced</option>
			<option value="minimal">Minimal</option>
		</Select>
	</Field>

	<Field label="Nutritional support required?">
		<RadioGroup label="Nutritional support">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nutritionalSupport" value={opt.value} bind:group={fn.nutritionalSupportRequired} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
