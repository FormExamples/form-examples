<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.presentingSkinConcern;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const onsetOptions = [
		{ value: 'sudden', label: 'Sudden (hours)' },
		{ value: 'acute', label: 'Acute (days)' },
		{ value: 'subacute', label: 'Subacute (weeks)' },
		{ value: 'chronic', label: 'Chronic (months/years)' }
	];
</script>

<Fieldset legend="Presenting Skin Concern">
	<p class="hint">Why is the patient being assessed today?</p>

	<Field label="Chief complaint" inputId="chiefComplaint">
		<TextAreaInput id="chiefComplaint" label="Chief complaint" rows={2} placeholder="In the patient’s own words…" bind:value={d.chiefComplaint} />
	</Field>

	<Field label="Onset" inputId="onset">
		<Select id="onset" label="Onset" bind:value={d.onset}>
			<option value="">— Select —</option>
			{#each onsetOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Duration" inputId="duration">
		<TextInput id="duration" label="Duration" placeholder="e.g. 3 weeks" bind:value={d.duration} />
	</Field>

	<Field label="Body location(s)" inputId="location">
		<TextInput id="location" label="Body location(s)" placeholder="e.g. Bilateral lower legs" bind:value={d.location} />
	</Field>

	<Field label="Pain at site?">
		<RadioGroup label="Pain at site?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pain" value={opt.value} bind:group={d.pain} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.pain === 'yes'}
		<Field label="Pain score (0-10)" inputId="painScore">
			<NumberInput id="painScore" label="Pain score" min={0} max={10} bind:value={d.painScore} />
		</Field>
	{/if}

	<Field label="Itching?">
		<RadioGroup label="Itching?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="itching" value={opt.value} bind:group={d.itching} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Bleeding?">
		<RadioGroup label="Bleeding?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bleeding" value={opt.value} bind:group={d.bleeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Discharge?">
		<RadioGroup label="Discharge?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="discharge" value={opt.value} bind:group={d.discharge} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Aggravating factors" inputId="aggravatingFactors">
		<TextInput id="aggravatingFactors" label="Aggravating factors" placeholder="e.g. heat, sweating, friction" bind:value={d.aggravatingFactors} />
	</Field>
	<Field label="Relieving factors" inputId="relievingFactors">
		<TextInput id="relievingFactors" label="Relieving factors" placeholder="e.g. cool compresses, antihistamines" bind:value={d.relievingFactors} />
	</Field>
	<Field label="Prior treatment" inputId="priorTreatment">
		<TextAreaInput id="priorTreatment" label="Prior treatment" rows={3} placeholder="OTC products, prescribed medications, dressings…" bind:value={d.priorTreatment} />
	</Field>
</Fieldset>
