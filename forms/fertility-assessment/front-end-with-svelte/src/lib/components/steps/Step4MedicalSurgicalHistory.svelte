<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const h = assessment.data.medicalSurgicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const conditions = [
		{ field: 'pelvicInflammatoryDisease', label: 'Pelvic inflammatory disease (PID)?' },
		{ field: 'endometriosis', label: 'Endometriosis?' },
		{ field: 'polycysticOvarySyndrome', label: 'Polycystic ovary syndrome (PCOS)?' },
		{ field: 'fibroids', label: 'Uterine fibroids?' },
		{ field: 'thyroidDisorder', label: 'Thyroid disorder?' },
		{ field: 'diabetes', label: 'Diabetes?' }
	] as const;
</script>

<Fieldset legend="Medical & Surgical History">
	<p class="hint">Conditions and surgeries that may affect fertility.</p>

	{#each conditions as cond (cond.field)}
		<Field label={cond.label}>
			<RadioGroup label={cond.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={cond.field} value={opt.value} bind:group={h[cond.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="History of cancer or cancer treatment?">
		<RadioGroup label="History of cancer or cancer treatment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cancerHistory" value={opt.value} bind:group={h.cancerHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.cancerHistory === 'yes'}
		<Field label="Cancer / treatment details (chemotherapy, radiotherapy, surgery)" inputId="medicalSurgicalHistory-cancerTreatmentDetails">
			<TextAreaInput id="medicalSurgicalHistory-cancerTreatmentDetails" label="Cancer / treatment details" rows={3} bind:value={h.cancerTreatmentDetails} />
		</Field>
	{/if}

	<Field label="Prior pelvic or abdominal surgery?">
		<RadioGroup label="Prior pelvic or abdominal surgery?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pelvicSurgery" value={opt.value} bind:group={h.pelvicSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.pelvicSurgery === 'yes'}
		<Field label="Pelvic / abdominal surgery details" inputId="medicalSurgicalHistory-pelvicSurgeryDetails">
			<TextAreaInput id="medicalSurgicalHistory-pelvicSurgeryDetails" label="Pelvic / abdominal surgery details" rows={3} bind:value={h.pelvicSurgeryDetails} />
		</Field>
	{/if}

	<Field label="History of sexually transmitted infections (STIs)?">
		<RadioGroup label="History of sexually transmitted infections (STIs)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sexuallyTransmittedInfections" value={opt.value} bind:group={h.sexuallyTransmittedInfections} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.sexuallyTransmittedInfections === 'yes'}
		<Field label="STI details (organism, year, treatment)" inputId="medicalSurgicalHistory-stiDetails">
			<TextInput id="medicalSurgicalHistory-stiDetails" label="STI details" bind:value={h.stiDetails} />
		</Field>
	{/if}

	<Field label="Other medical conditions" inputId="medicalSurgicalHistory-otherConditions">
		<TextAreaInput id="medicalSurgicalHistory-otherConditions" label="Other medical conditions" rows={3} placeholder="Any other conditions…" bind:value={h.otherConditions} />
	</Field>
</Fieldset>
