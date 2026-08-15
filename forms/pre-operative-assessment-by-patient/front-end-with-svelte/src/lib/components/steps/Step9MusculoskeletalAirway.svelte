<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const m = assessment.data.musculoskeletalAirway;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Musculoskeletal & Airway">
	<p class="hint">Joint, spine and airway assessment</p>
	<Field label="Do you have rheumatoid arthritis?"><RadioGroup label="Do you have rheumatoid arthritis?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="ra" value={opt.value} bind:group={m.rheumatoidArthritis}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Do you have any cervical spine (neck) problems?"><RadioGroup label="Do you have any cervical spine (neck) problems?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="cspine" value={opt.value} bind:group={m.cervicalSpineIssues}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Do you have limited neck movement?"><RadioGroup label="Do you have limited neck movement?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="neckMov" value={opt.value} bind:group={m.limitedNeckMovement}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Do you have limited mouth opening?"><RadioGroup label="Do you have limited mouth opening?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="mouthOpen" value={opt.value} bind:group={m.limitedMouthOpening}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Do you have any dental issues (loose/capped teeth, dentures)?"><RadioGroup label="Do you have any dental issues (loose/capped teeth, dentures)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="dental" value={opt.value} bind:group={m.dentalIssues}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if m.dentalIssues === 'yes'}
		<Field label="Please provide details" inputId="dentalDetails"><TextInput id="dentalDetails" label="Please provide details" bind:value={m.dentalDetails} /></Field>
	{/if}

	<Field label="Have you ever been told you had a difficult airway?"><RadioGroup label="Have you ever been told you had a difficult airway?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="diffAirway" value={opt.value} bind:group={m.previousDifficultAirway}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Mallampati Score (if known)" inputId="mallampati"><Select id="mallampati" label="Mallampati Score (if known)" bind:value={m.mallampatiScore}><option value="">-- Select --</option>{#each [
			{ value: '1', label: 'Class 1' },
			{ value: '2', label: 'Class 2' },
			{ value: '3', label: 'Class 3' },
			{ value: '4', label: 'Class 4' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>

	<Field label="Do you have arthritis or other joint problems?"><RadioGroup label="Do you have arthritis or other joint problems?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="jointProblems" value={opt.value} bind:group={m.jointOrArthritisProblems}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Do you have back or neck problems?"><RadioGroup label="Do you have back or neck problems?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="backNeck" value={opt.value} bind:group={m.backOrNeckProblems}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Do you have any skin conditions (e.g. dermatitis, thin skin, eczema)?"><RadioGroup label="Do you have any skin conditions?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="skinConditions" value={opt.value} bind:group={m.skinConditions}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Are you at risk of pressure sores, or have you had them in the past?"><RadioGroup label="Are you at risk of pressure sores, or have you had them in the past?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="pressureSore" value={opt.value} bind:group={m.pressureSoreRisk}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
