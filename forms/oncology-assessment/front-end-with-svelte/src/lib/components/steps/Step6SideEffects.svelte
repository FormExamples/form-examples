<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const se = assessment.data.sideEffects;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Side Effects">
	<p class="hint">Treatment-related adverse effects (CTCAE grading).</p>

	<Field label="Neuropathy (CTCAE Grade)" inputId="neuropathy">
		<Select id="neuropathy" label="Neuropathy" bind:value={se.neuropathy}>
			<option value="">-- Select --</option>
			<option value="0">Grade 0 - None</option>
			<option value="1">Grade 1 - Mild</option>
			<option value="2">Grade 2 - Moderate</option>
			<option value="3">Grade 3 - Severe</option>
			<option value="4">Grade 4 - Life-threatening</option>
		</Select>
	</Field>
	{#if se.neuropathy === '2' || se.neuropathy === '3' || se.neuropathy === '4'}
		<Field label="Neuropathy details" inputId="neuropathyDetails">
			<TextAreaInput id="neuropathyDetails" label="Neuropathy details" rows={2} placeholder="Distribution, functional impact" bind:value={se.neuropathyDetails} />
		</Field>
	{/if}

	<Field label="Mucositis (CTCAE Grade)" inputId="mucositis">
		<Select id="mucositis" label="Mucositis" bind:value={se.mucositis}>
			<option value="">-- Select --</option>
			<option value="0">Grade 0 - None</option>
			<option value="1">Grade 1 - Mild</option>
			<option value="2">Grade 2 - Moderate</option>
			<option value="3">Grade 3 - Severe</option>
			<option value="4">Grade 4 - Life-threatening</option>
		</Select>
	</Field>

	<Field label="Skin Reactions (CTCAE Grade)" inputId="skinReactions">
		<Select id="skinReactions" label="Skin Reactions" bind:value={se.skinReactions}>
			<option value="">-- Select --</option>
			<option value="0">Grade 0 - None</option>
			<option value="1">Grade 1 - Mild</option>
			<option value="2">Grade 2 - Moderate</option>
			<option value="3">Grade 3 - Severe</option>
			<option value="4">Grade 4 - Life-threatening</option>
		</Select>
	</Field>
	{#if se.skinReactions === '2' || se.skinReactions === '3' || se.skinReactions === '4'}
		<Field label="Skin reaction details" inputId="skinReactionDetails">
			<TextAreaInput id="skinReactionDetails" label="Skin reaction details" rows={2} placeholder="Type, location, management" bind:value={se.skinReactionDetails} />
		</Field>
	{/if}

	<Field label="Myelosuppression present?">
		<RadioGroup label="Myelosuppression">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="myelosuppression" value={opt.value} bind:group={se.myelosuppression} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if se.myelosuppression === 'yes'}
		<Field label="Neutropenia?">
			<RadioGroup label="Neutropenia">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="neutropenia" value={opt.value} bind:group={se.neutropenia} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Thrombocytopenia?">
			<RadioGroup label="Thrombocytopenia">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="thrombocytopenia" value={opt.value} bind:group={se.thrombocytopenia} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Anaemia?">
			<RadioGroup label="Anaemia">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="anaemia" value={opt.value} bind:group={se.anaemia} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Organ Toxicity (CTCAE Grade)" inputId="organToxicity">
		<Select id="organToxicity" label="Organ Toxicity" bind:value={se.organToxicityGrade}>
			<option value="">-- Select --</option>
			<option value="0">Grade 0 - None</option>
			<option value="1">Grade 1 - Mild</option>
			<option value="2">Grade 2 - Moderate</option>
			<option value="3">Grade 3 - Severe</option>
			<option value="4">Grade 4 - Life-threatening</option>
		</Select>
	</Field>
	{#if se.organToxicityGrade === '2' || se.organToxicityGrade === '3' || se.organToxicityGrade === '4'}
		<Field label="Organ toxicity details" inputId="organToxicityDetails">
			<TextAreaInput id="organToxicityDetails" label="Organ toxicity details" rows={2} placeholder="Organ affected, details" bind:value={se.organToxicityDetails} />
		</Field>
	{/if}
</Fieldset>
