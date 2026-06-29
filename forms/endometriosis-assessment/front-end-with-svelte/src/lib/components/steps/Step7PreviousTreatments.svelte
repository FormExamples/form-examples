<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.previousTreatments;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const effectiveness = [
		{ value: 'effective', label: 'Effective' },
		{ value: 'partially', label: 'Partially effective' },
		{ value: 'ineffective', label: 'Ineffective' }
	];
</script>

<Fieldset legend="Previous Treatments">
	<p class="hint">Medications and hormonal therapies tried, and their effect.</p>

	<Field label="NSAIDs tried?">
		<RadioGroup label="NSAIDs tried?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nsaidsTried" value={opt.value} bind:group={t.nsaidsTried} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if t.nsaidsTried === 'yes'}
		<Field label="NSAIDs effectiveness" inputId="nsaidsEffective">
			<Select id="nsaidsEffective" label="NSAIDs effectiveness" bind:value={t.nsaidsEffective}>
				<option value="">-- Select --</option>
				{#each effectiveness as e (e.value)}<option value={e.value}>{e.label}</option>{/each}
			</Select>
		</Field>
	{/if}

	<Field label="Paracetamol tried?">
		<RadioGroup label="Paracetamol tried?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="paracetamolTried" value={opt.value} bind:group={t.paracetamolTried} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Opioids tried?">
		<RadioGroup label="Opioids tried?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="opioidsTried" value={opt.value} bind:group={t.opioidsTried} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if t.opioidsTried === 'yes'}
		<Field label="Currently taking opioids?">
			<RadioGroup label="Currently taking opioids?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="opioidsCurrent" value={opt.value} bind:group={t.opioidsCurrent} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Combined pill tried?">
		<RadioGroup label="Combined pill tried?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="combinedPillTried" value={opt.value} bind:group={t.combinedPillTried} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if t.combinedPillTried === 'yes'}
		<Field label="Combined pill effectiveness" inputId="combinedPillEffective">
			<Select id="combinedPillEffective" label="Combined pill effectiveness" bind:value={t.combinedPillEffective}>
				<option value="">-- Select --</option>
				{#each effectiveness as e (e.value)}<option value={e.value}>{e.label}</option>{/each}
			</Select>
		</Field>
	{/if}

	<Field label="Progesterone tried?">
		<RadioGroup label="Progesterone tried?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="progesteroneTried" value={opt.value} bind:group={t.progesteroneTried} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if t.progesteroneTried === 'yes'}
		<Field label="Progesterone type" inputId="progesteroneType">
			<TextInput id="progesteroneType" label="Progesterone type" placeholder="e.g. Norethisterone, Dienogest" bind:value={t.progesteroneType} />
		</Field>
	{/if}

	<Field label="GnRH agonist tried?">
		<RadioGroup label="GnRH agonist tried?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="gnrhAgonistTried" value={opt.value} bind:group={t.gnrhAgonistTried} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if t.gnrhAgonistTried === 'yes'}
		<Field label="GnRH agonist duration (months)" inputId="gnrhAgonistDurationMonths">
			<NumberInput id="gnrhAgonistDurationMonths" label="GnRH agonist duration" min={0} max={120} bind:value={t.gnrhAgonistDurationMonths} />
		</Field>
	{/if}

	<Field label="Mirena IUS tried?">
		<RadioGroup label="Mirena IUS tried?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="mirenaIusTried" value={opt.value} bind:group={t.mirenaIusTried} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other treatments" inputId="otherTreatments">
		<TextInput id="otherTreatments" label="Other treatments" bind:value={t.otherTreatments} />
	</Field>

	<Field label="Treatment notes" inputId="treatmentNotes">
		<TextAreaInput id="treatmentNotes" label="Treatment notes" rows={2} bind:value={t.treatmentNotes} />
	</Field>
</Fieldset>
