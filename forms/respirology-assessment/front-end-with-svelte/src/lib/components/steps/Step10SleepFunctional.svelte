<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateStopBang } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const sf = assessment.data.sleepFunctional;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const sleepOptions = [
		{ value: 'good', label: 'Good' },
		{ value: 'fair', label: 'Fair' },
		{ value: 'poor', label: 'Poor' }
	];
	const functionalOptions = [
		{ value: 'independent', label: 'Independent - able to perform all daily activities' },
		{ value: 'limited', label: 'Limited - needs some assistance with daily activities' },
		{ value: 'dependent', label: 'Dependent - needs significant assistance' }
	];

	const stopBangQuestions: { key: 'osaScreenSnoring' | 'osaScreenTired' | 'osaScreenObservedApnoea' | 'osaScreenBMIOver35' | 'osaScreenAge50Plus' | 'osaScreenNeckOver40cm' | 'osaScreenMale'; name: string; label: string }[] = [
		{ key: 'osaScreenSnoring', name: 'snoring', label: 'Do you SNORE loudly?' },
		{ key: 'osaScreenTired', name: 'tired', label: 'Do you feel TIRED or sleepy during the day?' },
		{ key: 'osaScreenObservedApnoea', name: 'observed', label: 'Has anyone OBSERVED you stop breathing during sleep?' },
		{ key: 'osaScreenBMIOver35', name: 'bmiOver35', label: 'Is your BMI over 35?' },
		{ key: 'osaScreenAge50Plus', name: 'age50Plus', label: 'Are you aged 50 or over?' },
		{ key: 'osaScreenNeckOver40cm', name: 'neckOver40', label: 'Is your neck circumference over 40cm?' },
		{ key: 'osaScreenMale', name: 'male', label: 'Are you male?' }
	];

	$effect(() => {
		assessment.data.sleepFunctional.stopBangScore = calculateStopBang(
			sf.osaScreenSnoring,
			sf.osaScreenTired,
			sf.osaScreenObservedApnoea,
			sf.osaScreenBMIOver35,
			sf.osaScreenAge50Plus,
			sf.osaScreenNeckOver40cm,
			sf.osaScreenMale
		);
	});

	const stopBangDesc = $derived(
		sf.stopBangScore === null ? 'Auto-calculated'
		: sf.stopBangScore >= 5 ? `${sf.stopBangScore}/7 (High risk of OSA)`
		: sf.stopBangScore >= 3 ? `${sf.stopBangScore}/7 (Intermediate risk of OSA)`
		: `${sf.stopBangScore}/7 (Low risk of OSA)`
	);
</script>

<Fieldset legend="Sleep & Functional Status">
	<p class="hint">Sleep quality, OSA screening, and functional capacity.</p>

	<Field label="Sleep Quality" inputId="sleepQuality">
		<Select id="sleepQuality" label="Sleep quality" bind:value={sf.sleepQuality}>
			<option value="">-- Select --</option>
			{#each sleepOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<h3 class="step-subhead">STOP-BANG OSA Screening</h3>
	{#each stopBangQuestions as q (q.key)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.name} value={opt.value} bind:group={sf[q.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="STOP-BANG Score" description={stopBangDesc}>
		<p class="static-value">{sf.stopBangScore ?? '—'}</p>
	</Field>

	<Field label="Do you experience excessive daytime somnolence?">
		<RadioGroup label="Daytime somnolence">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="somnolence" value={opt.value} bind:group={sf.daytimeSomnolence} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if sf.daytimeSomnolence === 'yes'}
		<Field label="Epworth Sleepiness Scale Score" inputId="epworth">
			<NumberInput id="epworth" label="Epworth score" min={0} max={24} bind:value={sf.epworthScore} />
		</Field>
	{/if}

	<Field label="Functional Status" inputId="functionalStatus">
		<Select id="functionalStatus" label="Functional status" bind:value={sf.functionalStatus}>
			<option value="">-- Select --</option>
			{#each functionalOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
</Fieldset>

<style>
	.step-subhead { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
	.static-value { margin: 0; font-weight: 500; }
</style>
