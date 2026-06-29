<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const r = assessment.data.riskScreen;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Risk Screen">
	<p class="hint">A few short safety questions. Your answers help your clinician keep you safe and supported. If you are in immediate danger, contact emergency services.</p>

	<Alert type="warning">
		If you are having thoughts of suicide or self-harm right now, please call your local emergency number, or contact a crisis line such as the Samaritans (UK 116 123) or 988 Suicide &amp; Crisis Lifeline (US).
	</Alert>

	<Field label="In the past two weeks, have you had thoughts of suicide or that you would be better off dead?">
		<RadioGroup label="Suicidal ideation">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="suicidalIdeation" value={opt.value} bind:group={r.suicidalIdeation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if r.suicidalIdeation === 'yes'}
		<Field label="If you feel comfortable, please share more (frequency, plans, intent)" inputId="suicidalIdeationDetails">
			<TextAreaInput id="suicidalIdeationDetails" label="Ideation details" rows={3} bind:value={r.suicidalIdeationDetails} />
		</Field>
	{/if}

	<Field label="In the past two weeks, have you intentionally hurt yourself (e.g. cutting, burning)?">
		<RadioGroup label="Self-harm">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="selfHarm" value={opt.value} bind:group={r.selfHarm} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="In the past two weeks, have you had thoughts of harming someone else?">
		<RadioGroup label="Harm to others">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="harmToOthers" value={opt.value} bind:group={r.harmToOthers} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you ever had a psychiatric emergency (e.g. ED visit, crisis admission, sectioning)?">
		<RadioGroup label="Psychiatric emergency history">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="psychiatricEmergencyHistory" value={opt.value} bind:group={r.psychiatricEmergencyHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you currently have a written or agreed safety plan?">
		<RadioGroup label="Safety plan">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasSafetyPlan" value={opt.value} bind:group={r.hasSafetyPlan} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
