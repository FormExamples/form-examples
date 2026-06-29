<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.currentMedications;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Medications">
	<p class="hint">Medications relevant to dental treatment.</p>

	<Field label="Are you taking anticoagulants (blood thinners)?">
		<RadioGroup label="Anticoagulant use">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anticoagulantUse" value={opt.value} bind:group={m.anticoagulantUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.anticoagulantUse === 'yes'}
		<Field label="Anticoagulant name and dose" inputId="anticoagulantType">
			<TextInput id="anticoagulantType" label="Anticoagulant" bind:value={m.anticoagulantType} />
		</Field>
	{/if}

	<Field label="Are you currently taking bisphosphonates?">
		<RadioGroup label="Current bisphosphonate use">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bisphosphonateCurrentUse" value={opt.value} bind:group={m.bisphosphonateCurrentUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.bisphosphonateCurrentUse === 'yes'}
		<Field label="Bisphosphonate name" inputId="bisphosphonateName">
			<TextInput id="bisphosphonateName" label="Bisphosphonate name" bind:value={m.bisphosphonateName} />
		</Field>
	{/if}

	<Field label="Are you taking immunosuppressant medications?">
		<RadioGroup label="Immunosuppressant use">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="immunosuppressantUse" value={opt.value} bind:group={m.immunosuppressantUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.immunosuppressantUse === 'yes'}
		<Field label="Immunosuppressant name" inputId="immunosuppressantName">
			<TextInput id="immunosuppressantName" label="Immunosuppressant name" bind:value={m.immunosuppressantName} />
		</Field>
	{/if}

	<Field label="Do you have any allergies to dental anaesthetics?">
		<RadioGroup label="Anaesthetic allergies">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="allergyToAnaesthetics" value={opt.value} bind:group={m.allergyToAnaesthetics} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.allergyToAnaesthetics === 'yes'}
		<Field label="Anaesthetic allergy details" inputId="anaestheticAllergyDetails">
			<TextInput id="anaestheticAllergyDetails" label="Anaesthetic allergy details" bind:value={m.anaestheticAllergyDetails} />
		</Field>
	{/if}

	<Field label="Other medications" inputId="otherMedications">
		<TextAreaInput id="otherMedications" label="Other medications" rows={3} bind:value={m.otherMedications} />
	</Field>
</Fieldset>
