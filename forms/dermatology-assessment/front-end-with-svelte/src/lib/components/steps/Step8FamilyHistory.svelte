<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.familyHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const questions: { key: keyof typeof f; label: string; name: string }[] = [
		{ key: 'psoriasis', label: 'Does anyone in your family have psoriasis?', name: 'fhPsoriasis' },
		{ key: 'eczema', label: 'Does anyone in your family have eczema/atopic dermatitis?', name: 'fhEczema' },
		{ key: 'melanoma', label: 'Does anyone in your family have a history of melanoma?', name: 'fhMelanoma' },
		{ key: 'skinCancer', label: 'Does anyone in your family have a history of non-melanoma skin cancer?', name: 'fhSkinCancer' },
		{ key: 'autoimmune', label: 'Does anyone in your family have an autoimmune disease?', name: 'fhAutoimmune' }
	];
</script>

<Fieldset legend="Family History">
	<p class="hint">Skin conditions and relevant diseases in your family.</p>

	{#each questions as q (q.key)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.name} value={opt.value} bind:group={f[q.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Any other relevant family history" inputId="fhOther">
		<TextAreaInput id="fhOther" label="Other family history" rows={3} placeholder="Please describe any other skin-related conditions in your family..." bind:value={f.otherDetails} />
	</Field>
</Fieldset>
