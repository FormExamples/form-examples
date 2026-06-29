<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.carePlanMonitoring;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Care Plan & Monitoring">
	<p class="hint">Goals, planned interventions, monitoring, and follow-up.</p>

	<Field label="Nutrition goals" inputId="nutritionGoals">
		<TextAreaInput id="nutritionGoals" label="Nutrition goals" rows={3} placeholder="e.g. weight gain of 0.5 kg/week, maintain hydration…" bind:value={c.nutritionGoals} />
	</Field>
	<Field label="Planned interventions" inputId="interventionsPlanned">
		<TextAreaInput id="interventionsPlanned" label="Planned interventions" rows={3} placeholder="e.g. food fortification, ONS twice daily, SLT review…" bind:value={c.interventionsPlanned} />
	</Field>

	<Field label="Is weight monitoring planned?">
		<RadioGroup label="Weight monitoring planned">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="weightMonitoringPlanned" value={opt.value} bind:group={c.weightMonitoringPlanned} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.weightMonitoringPlanned === 'yes'}
		<Field label="Weight monitoring frequency" inputId="weightMonitoringFrequency">
			<Select id="weightMonitoringFrequency" label="Weight monitoring frequency" bind:value={c.weightMonitoringFrequency}>
				<option value="">— Select —</option>
				<option value="daily">Daily</option>
				<option value="twice-weekly">Twice weekly</option>
				<option value="weekly">Weekly</option>
				<option value="fortnightly">Fortnightly</option>
				<option value="monthly">Monthly</option>
			</Select>
		</Field>
	{/if}

	<Field label="Is food-intake monitoring planned (e.g. food chart)?">
		<RadioGroup label="Food-intake monitoring planned">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="foodIntakeMonitoringPlanned" value={opt.value} bind:group={c.foodIntakeMonitoringPlanned} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Is referral to another service required?">
		<RadioGroup label="Referral required">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="referralRequired" value={opt.value} bind:group={c.referralRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.referralRequired === 'yes'}
		<Field label="Referral details" inputId="referralDetails">
			<TextAreaInput id="referralDetails" label="Referral details" rows={2} placeholder="e.g. dietician, SLT, gastroenterology…" bind:value={c.referralDetails} />
		</Field>
	{/if}

	<Field label="Follow-up date" inputId="followUpDate">
		<DateInput id="followUpDate" label="Follow-up date" bind:value={c.followUpDate} />
	</Field>
	<Field label="Additional notes" inputId="additionalNotes">
		<TextAreaInput id="additionalNotes" label="Additional notes" rows={3} bind:value={c.additionalNotes} />
	</Field>
</Fieldset>
