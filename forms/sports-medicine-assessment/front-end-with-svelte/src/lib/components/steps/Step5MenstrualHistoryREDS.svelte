<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const r = assessment.data.menstrualHistoryREDS;

	// RED-S screening applies to female athletes; mirror the demographics sex.
	$effect(() => {
		assessment.data.menstrualHistoryREDS.applicable =
			assessment.data.demographics.sex === 'female';
	});

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Menstrual History / RED-S Screening">
	<p class="hint">Relative Energy Deficiency in Sport (RED-S) screening for female athletes.</p>

	{#if r.applicable}
		<Field label="Age at menarche (years)" inputId="ageAtMenarche">
			<NumberInput id="ageAtMenarche" label="Age at menarche" min={8} max={20} bind:value={r.ageAtMenarche} />
		</Field>

		<Field label="Regular periods?">
			<RadioGroup label="Regular periods?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="regularPeriods" value={opt.value} bind:group={r.regularPeriods} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Amenorrhoea for more than 6 months?">
			<RadioGroup label="Amenorrhoea for more than 6 months?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="amenorrhoea" value={opt.value} bind:group={r.amenorrhoeaSixMonths} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Menstrual cycles in the last 12 months" inputId="cyclesLast12Months">
			<NumberInput id="cyclesLast12Months" label="Cycles in last 12 months" min={0} max={13} bind:value={r.cyclesLast12Months} />
		</Field>

		<Field label="Restrictive eating pattern?">
			<RadioGroup label="Restrictive eating pattern?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="restrictiveEating" value={opt.value} bind:group={r.restrictiveEatingPattern} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="History of stress fracture?">
			<RadioGroup label="History of stress fracture?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="stressFracture" value={opt.value} bind:group={r.stressFractureHistory} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Concern about low energy availability?">
			<RadioGroup label="Concern about low energy availability?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="lowEnergy" value={opt.value} bind:group={r.lowEnergyAvailabilityConcern} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{:else}
		<p class="hint">RED-S screening is not applicable for this athlete (recorded sex is not female). Set sex to "Female" in Demographics to complete this section.</p>
	{/if}
</Fieldset>
