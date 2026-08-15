<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const r = assessment.data.riskAssessment;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const violenceOptions = [
		{ value: 'none', label: 'None identified' },
		{ value: 'low', label: 'Low' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'high', label: 'High' },
		{ value: 'imminent', label: 'Imminent' }
	];
</script>

<Fieldset legend="Risk Assessment">
	<p class="hint">Assessment of risk to self and others.</p>

	<Field label="Is the patient experiencing suicidal ideation?">
		<RadioGroup label="Suicidal ideation">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="suicidalIdeation" value={opt.value} bind:group={r.suicidalIdeation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if r.suicidalIdeation === 'yes'}
		<Field label="Does the patient have a suicide plan?">
			<RadioGroup label="Suicide plan">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="suicidalPlan" value={opt.value} bind:group={r.suicidalPlan} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Does the patient express intent to act?">
			<RadioGroup label="Suicidal intent">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="suicidalIntent" value={opt.value} bind:group={r.suicidalIntent} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Does the patient have access to means?">
			<RadioGroup label="Access to means">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="suicidalMeans" value={opt.value} bind:group={r.suicidalMeans} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Protective Factors" inputId="protectiveFactors">
		<TextAreaInput id="protectiveFactors" label="Protective factors" rows={3} bind:value={r.protectiveFactors} />
	</Field>

	<Field label="Current self-harm behaviour?">
		<RadioGroup label="Current self-harm">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="selfHarmCurrent" value={opt.value} bind:group={r.selfHarmCurrent} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Violence Risk" inputId="violenceRisk">
		<Select id="violenceRisk" label="Violence risk" bind:value={r.violenceRisk}>
			<option value="">-- Select --</option>
			{#each violenceOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Safeguarding concerns?">
		<RadioGroup label="Safeguarding">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="safeguarding" value={opt.value} bind:group={r.safeguardingConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.safeguardingConcerns === 'yes'}
		<Field label="Safeguarding Details" inputId="safeguardingDetails">
			<TextAreaInput id="safeguardingDetails" label="Safeguarding details" rows={3} bind:value={r.safeguardingDetails} />
		</Field>
	{/if}
</Fieldset>
