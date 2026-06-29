<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Previous skin conditions and relevant medical history.</p>

	<Field label="Previous skin conditions" inputId="previousSkin">
		<TextAreaInput id="previousSkin" label="Previous skin conditions" rows={3} placeholder="e.g., eczema, psoriasis, acne, rosacea..." bind:value={m.previousSkinConditions} />
	</Field>

	<Field label="Do you have any autoimmune diseases?">
		<RadioGroup label="Do you have any autoimmune diseases?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="autoimmune" value={opt.value} bind:group={m.autoimmuneDiseases} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.autoimmuneDiseases === 'yes'}
		<Field label="Please provide details" inputId="autoimmuneDetails">
			<TextAreaInput id="autoimmuneDetails" label="Autoimmune details" rows={3} bind:value={m.autoimmuneDiseaseDetails} />
		</Field>
	{/if}

	<Field label="Are you immunosuppressed or on immunosuppressive therapy?">
		<RadioGroup label="Immunosuppression">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="immunosuppression" value={opt.value} bind:group={m.immunosuppression} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.immunosuppression === 'yes'}
		<Field label="Please provide details" inputId="immunoDetails">
			<TextAreaInput id="immunoDetails" label="Immunosuppression details" rows={3} bind:value={m.immunosuppressionDetails} />
		</Field>
	{/if}

	<Field label="Do you have a history of cancer?">
		<RadioGroup label="Cancer history">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cancerHistory" value={opt.value} bind:group={m.cancerHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.cancerHistory === 'yes'}
		<Field label="Please provide details (type, treatment, current status)" inputId="cancerDetails">
			<TextAreaInput id="cancerDetails" label="Cancer details" rows={3} bind:value={m.cancerHistoryDetails} />
		</Field>
	{/if}
</Fieldset>
