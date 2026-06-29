<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const flags: { key: 'autoimmune' | 'thyroid' | 'diabetes' | 'hypertension'; label: string }[] = [
		{ key: 'autoimmune', label: 'Autoimmune disease (e.g., lupus, rheumatoid arthritis)' },
		{ key: 'thyroid', label: 'Thyroid disorder (hypo- or hyperthyroidism)' },
		{ key: 'diabetes', label: 'Pre-existing diabetes (Type 1 or Type 2)' },
		{ key: 'hypertension', label: 'Pre-existing hypertension' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Pre-existing conditions and chronic diseases.</p>

	<Field label="Chronic Conditions" inputId="chronicConditions">
		<TextAreaInput id="chronicConditions" label="Chronic conditions" rows={3} bind:value={m.chronicConditions} />
	</Field>

	{#each flags as f (f.key)}
		<Field label={f.label}>
			<RadioGroup label={f.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={f.key} value={opt.value} bind:group={m[f.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
