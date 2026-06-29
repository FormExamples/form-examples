<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const r = assessment.data.redFlagsSocial;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const smokingOptions = [
		{ value: 'current', label: 'Current smoker' },
		{ value: 'ex', label: 'Ex-smoker' },
		{ value: 'never', label: 'Never smoked' }
	];
</script>

<Fieldset legend="Red Flags & Social History">
	<p class="hint">Warning signs and lifestyle factors.</p>

	<Field label="Have you experienced unexplained weight loss?">
		<RadioGroup label="Unexplained weight loss">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="weightLoss" value={opt.value} bind:group={r.unexplainedWeightLoss} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.unexplainedWeightLoss === 'yes'}
		<Field label="How much weight have you lost and over what period?" inputId="weightLossAmount">
			<TextInput id="weightLossAmount" label="Weight loss amount" placeholder="e.g. 5kg in 3 months" bind:value={r.weightLossAmount} />
		</Field>
	{/if}

	<Field label="Has your appetite changed?">
		<RadioGroup label="Appetite change">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="appetiteChange" value={opt.value} bind:group={r.appetiteChange} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.appetiteChange === 'yes'}
		<Field label="Please describe the change" inputId="appetiteDetails">
			<TextInput id="appetiteDetails" label="Appetite details" placeholder="e.g. decreased appetite, loss of appetite" bind:value={r.appetiteDetails} />
		</Field>
	{/if}

	<Field label="Does anyone in your family have a history of GI cancer?">
		<RadioGroup label="Family GI cancer">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="familyCancer" value={opt.value} bind:group={r.familyGICancer} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.familyGICancer === 'yes'}
		<Field label="Please provide details (who, what type, age at diagnosis)" inputId="familyCancerDetails">
			<TextAreaInput id="familyCancerDetails" label="Family cancer details" rows={3} bind:value={r.familyCancerDetails} />
		</Field>
	{/if}

	<Field label="Do you smoke?">
		<RadioGroup label="Smoking">
			{#each smokingOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="smoking" value={opt.value} bind:group={r.smoking} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.smoking === 'current' || r.smoking === 'ex'}
		<Field label="Pack years" inputId="packYears">
			<NumberInput id="packYears" label="Pack years" min={0} max={200} bind:value={r.smokingPackYears} />
		</Field>
	{/if}

	<Field label="How would you describe your alcohol use?" inputId="alcoholUse">
		<Select id="alcoholUse" label="Alcohol use" bind:value={r.alcoholUse}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="occasional">Occasional</option>
			<option value="moderate">Moderate</option>
			<option value="heavy">Heavy</option>
		</Select>
	</Field>
</Fieldset>
