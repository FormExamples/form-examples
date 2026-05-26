<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.cardiacHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cardiac History">
	<p class="hint">Previous MI, interventions, valvular and structural disease.</p>

	<Field label="Have you had a previous heart attack (myocardial infarction)?">
		<RadioGroup label="Have you had a previous heart attack (myocardial infarction)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevMI" value={opt.value} bind:group={c.previousMI} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.previousMI === 'yes'}
		<Field label="When did it occur?" inputId="miDate">
			<DateInput id="miDate" label="When did it occur?" bind:value={c.miDate} />
		</Field>
		<Field label="Was it within the last 6 months?">
			<RadioGroup label="Was it within the last 6 months?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="recentMI" value={opt.value} bind:group={c.recentMI} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if c.recentMI === 'yes'}
			<Field label="How many weeks ago?" required inputId="recentMIWeeks">
				<NumberInput id="recentMIWeeks" label="How many weeks ago?" min={0} max={26} required bind:value={c.recentMIWeeks} />
			</Field>
		{/if}
	{/if}

	<Field label="Have you had PCI (stent/angioplasty)?">
		<RadioGroup label="Have you had PCI (stent/angioplasty)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pci" value={opt.value} bind:group={c.pci} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.pci === 'yes'}
		<Field label="PCI details" inputId="pciDetails">
			<TextInput id="pciDetails" label="PCI details" placeholder="e.g. Year, vessels treated" bind:value={c.pciDetails} />
		</Field>
	{/if}

	<Field label="Have you had CABG (bypass surgery)?">
		<RadioGroup label="Have you had CABG (bypass surgery)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cabg" value={opt.value} bind:group={c.cabg} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.cabg === 'yes'}
		<Field label="CABG details" inputId="cabgDetails">
			<TextInput id="cabgDetails" label="CABG details" placeholder="e.g. Year, number of grafts" bind:value={c.cabgDetails} />
		</Field>
	{/if}

	<Field label="Do you have any heart valve disease?">
		<RadioGroup label="Do you have any heart valve disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="valvular" value={opt.value} bind:group={c.valvularDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.valvularDisease === 'yes'}
		<Field label="Valve disease details" inputId="valvularDetails">
			<TextInput id="valvularDetails" label="Valve disease details" placeholder="e.g. Aortic stenosis, mitral regurgitation" bind:value={c.valvularDetails} />
		</Field>
	{/if}

	<Field label="Have you been diagnosed with cardiomyopathy?">
		<RadioGroup label="Have you been diagnosed with cardiomyopathy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cardiomyopathy" value={opt.value} bind:group={c.cardiomyopathy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.cardiomyopathy === 'yes'}
		<Field label="Type of cardiomyopathy" inputId="cardiomyopathyType">
			<Select id="cardiomyopathyType" label="Type of cardiomyopathy" bind:value={c.cardiomyopathyType}>
				<option value="">-- Select --</option>
				<option value="dilated">Dilated</option>
				<option value="hypertrophic">Hypertrophic</option>
				<option value="restrictive">Restrictive</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<Field label="Have you had pericarditis?">
		<RadioGroup label="Have you had pericarditis?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pericarditis" value={opt.value} bind:group={c.pericarditis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
