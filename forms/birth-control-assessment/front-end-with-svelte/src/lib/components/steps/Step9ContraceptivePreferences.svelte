<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.contraceptivePreferences;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const fertility = [
		{ value: 'within-1-year', label: 'Within 1 year' },
		{ value: '1-5-years', label: '1–5 years' },
		{ value: 'no-plans', label: 'No current plans' },
		{ value: 'completed-family', label: 'Completed family' }
	];
</script>

<Fieldset legend="Contraceptive Preferences" description="Method preferences and future plans.">
	<Field label="Preferred method" inputId="preferredMethod">
		<Select id="preferredMethod" label="Preferred method" bind:value={p.preferredMethod}>
			<option value="">-- Select --</option>
			<option value="coc">Combined oral contraception (COC)</option>
			<option value="pop">Progestogen-only pill (POP)</option>
			<option value="implant">Implant</option>
			<option value="injection">Injection</option>
			<option value="iud">Copper IUD</option>
			<option value="ius">Hormonal IUS</option>
			<option value="patch">Patch</option>
			<option value="ring">Vaginal ring</option>
			<option value="barrier">Barrier</option>
			<option value="natural">Natural / fertility awareness</option>
			<option value="unsure">Unsure</option>
		</Select>
	</Field>

	<RadioGroup label="Are hormonal methods acceptable to you?" name="hormonalAcceptable" options={yesNo} bind:value={p.hormonalAcceptable} />
	<RadioGroup label="Are long-acting reversible methods acceptable?" name="longActingAcceptable" options={yesNo} bind:value={p.longActingAcceptable} />
	<RadioGroup label="Are you happy to take a daily pill?" name="dailyPillAcceptable" options={yesNo} bind:value={p.dailyPillAcceptable} />
	<RadioGroup label="Are intrauterine methods acceptable?" name="intrauterineAcceptable" options={yesNo} bind:value={p.intrauterineAcceptable} />

	<RadioGroup label="Future fertility plans" name="fertilityPlans" options={fertility} bind:value={p.fertilityPlans} />

	<RadioGroup label="Currently breastfeeding?" name="breastfeeding" options={yesNo} bind:value={p.breastfeeding} />
	{#if p.breastfeeding === 'yes'}
		<NumberInput label="Weeks postpartum" name="postpartumWeeks" min={0} max={104} bind:value={p.postpartumWeeks} />
	{/if}

	<TextAreaInput label="Concerns or questions" name="concerns" rows={3} bind:value={p.concerns} />
</Fieldset>
