<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const r = assessment.data.riskScreen;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Risk Screen"
	description="A few short safety questions. Your answers help your clinician keep you safe and supported. If you are in immediate danger, contact emergency services."
>
	<div class="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
		If you are having thoughts of suicide or self-harm right now, please call your local
		emergency number, or contact a crisis line such as the Samaritans (UK 116 123) or 988
		Suicide &amp; Crisis Lifeline (US).
	</div>

	<RadioGroup
		label="In the past two weeks, have you had thoughts of suicide or that you would be better off dead?"
		name="suicidalIdeation"
		options={yesNoOptions}
		bind:value={r.suicidalIdeation}
	/>

	{#if r.suicidalIdeation === 'yes'}
		<TextArea
			label="If you feel comfortable, please share more (frequency, plans, intent)"
			name="suicidalIdeationDetails"
			bind:value={r.suicidalIdeationDetails}
			rows={3}
		/>
	{/if}

	<RadioGroup
		label="In the past two weeks, have you intentionally hurt yourself (e.g. cutting, burning)?"
		name="selfHarm"
		options={yesNoOptions}
		bind:value={r.selfHarm}
	/>

	<RadioGroup
		label="In the past two weeks, have you had thoughts of harming someone else?"
		name="harmToOthers"
		options={yesNoOptions}
		bind:value={r.harmToOthers}
	/>

	<RadioGroup
		label="Have you ever had a psychiatric emergency (e.g. ED visit, crisis admission, sectioning)?"
		name="psychiatricEmergencyHistory"
		options={yesNoOptions}
		bind:value={r.psychiatricEmergencyHistory}
	/>

	<RadioGroup
		label="Do you currently have a written or agreed safety plan?"
		name="hasSafetyPlan"
		options={yesNoOptions}
		bind:value={r.hasSafetyPlan}
	/>
</SectionCard>
