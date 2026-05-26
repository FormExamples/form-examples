<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.pregnancyDetails;

	const conceptionOptions = [
		{ value: 'natural', label: 'Natural conception' },
		{ value: 'ivf', label: 'IVF (In vitro fertilisation)' },
		{ value: 'iui', label: 'IUI (Intrauterine insemination)' },
		{ value: 'icsi', label: 'ICSI (Intracytoplasmic sperm injection)' },
		{ value: 'donor-egg', label: 'Donor egg' },
		{ value: 'donor-embryo', label: 'Donor embryo' },
		{ value: 'other', label: 'Other' }
	];
	const placentaOptions = [
		{ value: 'anterior', label: 'Anterior' },
		{ value: 'posterior', label: 'Posterior' },
		{ value: 'fundal', label: 'Fundal' },
		{ value: 'lateral', label: 'Lateral' },
		{ value: 'low-lying', label: 'Low-lying' },
		{ value: 'previa', label: 'Previa' }
	];
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Pregnancy Details">
	<p class="hint">Current pregnancy information.</p>

	<Field label="Gestational Age (weeks)" required inputId="gestationalWeeks">
		<NumberInput id="gestationalWeeks" label="Gestational age" min={1} max={45} required bind:value={p.gestationalWeeks} />
	</Field>

	<Field label="Estimated Due Date" required inputId="estimatedDueDate">
		<DateInput id="estimatedDueDate" label="Estimated due date" required bind:value={p.estimatedDueDate} />
	</Field>

	<Field label="Conception Method" required inputId="conceptionMethod">
		<Select id="conceptionMethod" label="Conception method" required bind:value={p.conceptionMethod}>
			<option value="">-- Select --</option>
			{#each conceptionOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Multiple Gestation (twins, triplets, etc.)" required>
		<RadioGroup label="Multiple gestation">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="multipleGestation" value={opt.value} bind:group={p.multipleGestation} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Placenta Location" inputId="placentaLocation">
		<Select id="placentaLocation" label="Placenta location" bind:value={p.placentaLocation}>
			<option value="">-- Select --</option>
			{#each placentaOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
</Fieldset>
