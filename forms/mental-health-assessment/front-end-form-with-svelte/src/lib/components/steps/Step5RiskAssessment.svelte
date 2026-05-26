<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const r = assessment.data.riskAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const siOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'passive', label: 'Passive thoughts (e.g., wishing to not wake up)' },
		{ value: 'active-no-plan', label: 'Active thoughts, no specific plan' },
		{ value: 'active-with-plan', label: 'Active thoughts with a specific plan' }
	];
	const shOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'past', label: 'In the past, but not currently' },
		{ value: 'current', label: 'Currently' }
	];
	const hoOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'thoughts', label: 'Thoughts, but no intent' },
		{ value: 'intent', label: 'Thoughts with intent' }
	];
</script>

<Fieldset legend="Risk Assessment">
	<p class="hint">These questions help us understand your safety needs. Please answer honestly.</p>

	<Alert type="info" heading="Important">
		<p>
			If you are in immediate danger, please call emergency services (999/911) or go to your
			nearest emergency department.
		</p>
	</Alert>

	<Field label="Have you had any thoughts of suicide or wanting to die?">
		<RadioGroup label="Suicidal ideation">
			{#each siOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="suicidalIdeation" value={opt.value} bind:group={r.suicidalIdeation} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.suicidalIdeation !== '' && r.suicidalIdeation !== 'none'}
		<Field label="Please provide more details" inputId="siDetails">
			<TextAreaInput id="siDetails" label="Suicidal ideation details" rows={3} bind:value={r.suicidalIdeationDetails} />
		</Field>
	{/if}

	<Field label="Have you engaged in any self-harm?">
		<RadioGroup label="Self harm">
			{#each shOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="selfHarm" value={opt.value} bind:group={r.selfHarm} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.selfHarm !== '' && r.selfHarm !== 'none'}
		<Field label="Please provide more details" inputId="shDetails">
			<TextAreaInput id="shDetails" label="Self harm details" rows={3} bind:value={r.selfHarmDetails} />
		</Field>
	{/if}

	<Field label="Have you had thoughts of harming others?">
		<RadioGroup label="Harm to others">
			{#each hoOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="harmToOthers" value={opt.value} bind:group={r.harmToOthers} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.harmToOthers !== '' && r.harmToOthers !== 'none'}
		<Field label="Please provide more details" inputId="hoDetails">
			<TextAreaInput id="hoDetails" label="Harm to others details" rows={3} bind:value={r.harmToOthersDetails} />
		</Field>
	{/if}

	{#if r.suicidalIdeation !== '' && r.suicidalIdeation !== 'none'}
		<Field label="Do you have a safety plan in place?">
			<RadioGroup label="Safety plan">
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name="safetyPlan" value={opt.value} bind:group={r.hasSafetyPlan} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if r.hasSafetyPlan === 'yes'}
			<Field label="Please describe your safety plan" inputId="safetyPlanDetails">
				<TextAreaInput id="safetyPlanDetails" label="Safety plan details" rows={3} bind:value={r.safetyPlanDetails} />
			</Field>
		{/if}
	{/if}
</Fieldset>
