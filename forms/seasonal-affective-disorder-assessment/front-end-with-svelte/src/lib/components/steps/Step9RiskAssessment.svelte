<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const r = assessment.data.riskAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Risk Assessment (Self-harm)">
	<Alert type="warning" heading="Safety screening">
		Any positive response below should prompt direct clinical follow-up and a documented safety plan.
	</Alert>

	<Field label="Thoughts of suicide / being better off dead (active ideation)?">
		<RadioGroup label="Suicidal ideation">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="suicidalIdeation" value={opt.value} bind:group={r.suicidalIdeation} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Suicidal intent?">
		<RadioGroup label="Suicidal intent">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="suicidalIntent" value={opt.value} bind:group={r.suicidalIntent} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Suicidal plan (describe if any)" inputId="suicidalPlan">
		<TextAreaInput id="suicidalPlan" label="Suicidal plan" rows={2} bind:value={r.suicidalPlan} />
	</Field>

	<Field label="Self-harm?">
		<RadioGroup label="Self-harm">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="selfHarm" value={opt.value} bind:group={r.selfHarm} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.selfHarm === 'yes'}
		<Field label="Self-harm details" inputId="selfHarmDetails">
			<TextAreaInput id="selfHarmDetails" label="Self-harm details" rows={2} bind:value={r.selfHarmDetails} />
		</Field>
	{/if}

	<Field label="Previous suicide attempt?">
		<RadioGroup label="Previous attempt">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="previousAttempt" value={opt.value} bind:group={r.previousAttempt} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Protective factors" inputId="protectiveFactors">
		<TextAreaInput id="protectiveFactors" label="Protective factors" rows={2} bind:value={r.protectiveFactors} />
	</Field>

	<Field label="Safety plan in place?">
		<RadioGroup label="Safety plan in place">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="safetyPlanInPlace" value={opt.value} bind:group={r.safetyPlanInPlace} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
