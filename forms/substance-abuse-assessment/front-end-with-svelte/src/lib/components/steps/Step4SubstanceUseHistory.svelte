<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.substanceUseHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Substance Use History">
	<p class="hint">Patterns and history of substance use.</p>

	<div class="field-grid">
		<Field label="Age at first alcohol use" inputId="ageFirstAlcoholUse">
			<NumberInput id="ageFirstAlcoholUse" label="Age at first alcohol use" min={0} max={120} bind:value={s.ageFirstAlcoholUse} />
		</Field>
		<Field label="Age at first drug use" inputId="ageFirstDrugUse">
			<NumberInput id="ageFirstDrugUse" label="Age at first drug use" min={0} max={120} bind:value={s.ageFirstDrugUse} />
		</Field>
	</div>

	<Field label="Primary substance of concern" inputId="primarySubstance">
		<Select id="primarySubstance" label="Primary substance of concern" bind:value={s.primarySubstance}>
			<option value="">-- Select --</option>
			<option value="alcohol">Alcohol</option>
			<option value="cannabis">Cannabis</option>
			<option value="cocaine">Cocaine</option>
			<option value="heroin">Heroin</option>
			<option value="methamphetamine">Methamphetamine</option>
			<option value="benzodiazepines">Benzodiazepines</option>
			<option value="opioid-painkillers">Opioid painkillers</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	{#if s.primarySubstance === 'other'}
		<Field label="Primary substance (other)" inputId="primarySubstanceOther">
			<TextInput id="primarySubstanceOther" label="Primary substance (other)" bind:value={s.primarySubstanceOther} />
		</Field>
	{/if}

	<Field label="Secondary substances used" inputId="secondarySubstances">
		<TextInput id="secondarySubstances" label="Secondary substances used" placeholder="e.g. cannabis, nicotine" bind:value={s.secondarySubstances} />
	</Field>

	<div class="field-grid">
		<Field label="Route of administration" inputId="routeOfAdministration">
			<Select id="routeOfAdministration" label="Route of administration" bind:value={s.routeOfAdministration}>
				<option value="">-- Select --</option>
				<option value="oral">Oral</option>
				<option value="smoking">Smoking</option>
				<option value="snorting">Snorting</option>
				<option value="injecting">Injecting</option>
				<option value="multiple">Multiple</option>
			</Select>
		</Field>
		<Field label="Frequency of use" inputId="frequencyOfUse">
			<Select id="frequencyOfUse" label="Frequency of use" bind:value={s.frequencyOfUse}>
				<option value="">-- Select --</option>
				<option value="daily">Daily</option>
				<option value="several-times-week">Several times a week</option>
				<option value="weekly">Weekly</option>
				<option value="monthly">Monthly</option>
				<option value="occasionally">Occasionally</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Duration of use" inputId="durationOfUse">
			<Select id="durationOfUse" label="Duration of use" bind:value={s.durationOfUse}>
				<option value="">-- Select --</option>
				<option value="less-1-year">Less than 1 year</option>
				<option value="1-5-years">1-5 years</option>
				<option value="5-10-years">5-10 years</option>
				<option value="greater-10-years">Greater than 10 years</option>
			</Select>
		</Field>
		<Field label="Date of last use" inputId="lastUseDate">
			<DateInput id="lastUseDate" label="Date of last use" bind:value={s.lastUseDate} />
		</Field>
	</div>

	<Field label="Current use status" inputId="currentUseStatus">
		<Select id="currentUseStatus" label="Current use status" bind:value={s.currentUseStatus}>
			<option value="">-- Select --</option>
			<option value="actively-using">Actively using</option>
			<option value="in-withdrawal">In withdrawal</option>
			<option value="early-recovery">Early recovery</option>
			<option value="sustained-recovery">Sustained recovery</option>
		</Select>
	</Field>

	<Field label="Intravenous (IV) drug use?">
		<RadioGroup label="Intravenous (IV) drug use?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ivDrugUse" value={opt.value} bind:group={s.ivDrugUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.ivDrugUse === 'yes'}
		<Field label="Needle sharing?">
			<RadioGroup label="Needle sharing?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="needleSharing" value={opt.value} bind:group={s.needleSharing} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
