<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.pastEntHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type YesNoKey =
		| 'chronicSinusitis'
		| 'allergicRhinitis'
		| 'hearingLoss'
		| 'tinnitus'
		| 'vertigo'
		| 'hearingAids'
		| 'headNeckCancer'
		| 'headNeckRadiotherapy'
		| 'smoking'
		| 'alcohol';
	const conditions: { key: YesNoKey; label: string; name: string }[] = [
		{ key: 'chronicSinusitis', label: 'Chronic sinusitis?', name: 'chronicSinusitis' },
		{ key: 'allergicRhinitis', label: 'Allergic rhinitis?', name: 'allergicRhinitis' },
		{ key: 'hearingLoss', label: 'Hearing loss?', name: 'hearingLoss' },
		{ key: 'tinnitus', label: 'Tinnitus?', name: 'tinnitus' },
		{ key: 'vertigo', label: 'Vertigo?', name: 'vertigo' },
		{ key: 'hearingAids', label: 'Hearing aids?', name: 'hearingAids' },
		{ key: 'headNeckCancer', label: 'History of head and neck cancer?', name: 'headNeckCancer' },
		{ key: 'headNeckRadiotherapy', label: 'Prior head and neck radiotherapy?', name: 'headNeckRadiotherapy' },
		{ key: 'smoking', label: 'Active smoking?', name: 'smoking' },
		{ key: 'alcohol', label: 'Significant alcohol use?', name: 'alcohol' }
	];
</script>

<Fieldset legend="Past ENT History & Surgery">
	<p class="hint">Relevant ENT conditions, prior surgery, and lifestyle risk factors.</p>

	<Field label="Prior ENT surgery?">
		<RadioGroup label="Prior ENT surgery?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="priorEntSurgery" value={opt.value} bind:group={p.priorEntSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if p.priorEntSurgery === 'yes'}
		<Field label="Prior ENT surgery details" inputId="priorEntSurgeryDetails">
			<TextAreaInput id="priorEntSurgeryDetails" label="Prior ENT surgery details" rows={2} bind:value={p.priorEntSurgeryDetails} />
		</Field>
	{/if}

	{#each conditions as cond (cond.key)}
		<Field label={cond.label}>
			<RadioGroup label={cond.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={cond.name} value={opt.value} bind:group={p[cond.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
