<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const lp = assessment.data.liverPancreas;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Liver & Pancreas">
	<p class="hint">Hepatobiliary and pancreatic symptoms.</p>

	<Field label="Have you noticed yellowing of the skin or eyes (jaundice)?">
		<RadioGroup label="Jaundice">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="jaundice" value={opt.value} bind:group={lp.jaundice} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you noticed dark-coloured urine?">
		<RadioGroup label="Dark urine">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="darkUrine" value={opt.value} bind:group={lp.darkUrine} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you noticed pale or clay-coloured stools?">
		<RadioGroup label="Pale stools">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="paleStools" value={opt.value} bind:group={lp.paleStools} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How would you describe your alcohol intake?" inputId="alcoholIntake">
		<Select id="alcoholIntake" label="Alcohol intake" bind:value={lp.alcoholIntake}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="occasional">Occasional (1-7 units/week)</option>
			<option value="moderate">Moderate (8-14 units/week)</option>
			<option value="heavy">Heavy (&gt;14 units/week)</option>
		</Select>
	</Field>

	{#if lp.alcoholIntake && lp.alcoholIntake !== 'none'}
		<Field label="Units per week" inputId="alcoholUnits">
			<NumberInput id="alcoholUnits" label="Alcohol units per week" min={0} max={200} bind:value={lp.alcoholUnitsPerWeek} />
		</Field>
	{/if}

	<Field label="Have you been exposed to hepatitis (e.g. travel, contact, injection)?">
		<RadioGroup label="Hepatitis exposure">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hepatitis" value={opt.value} bind:group={lp.hepatitisExposure} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if lp.hepatitisExposure === 'yes'}
		<Field label="Please provide details" inputId="hepatitisDetails">
			<TextInput id="hepatitisDetails" label="Hepatitis details" bind:value={lp.hepatitisDetails} />
		</Field>
	{/if}
</Fieldset>
