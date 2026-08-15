<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const r = assessment.data.restrictionsLimitations;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes - Exclude' },
		{ value: 'no', label: 'No - Include' }
	];

	const rows: { key: keyof typeof r; label: string; name: string }[] = [
		{ key: 'excludeHIV', label: 'Exclude HIV-related records?', name: 'excludeHIV' },
		{ key: 'excludeSubstanceAbuse', label: 'Exclude substance abuse treatment records?', name: 'excludeSubstanceAbuse' },
		{ key: 'excludeMentalHealth', label: 'Exclude mental health records?', name: 'excludeMentalHealth' },
		{ key: 'excludeGeneticInfo', label: 'Exclude genetic information?', name: 'excludeGeneticInfo' },
		{ key: 'excludeSTI', label: 'Exclude STI-related records?', name: 'excludeSTI' }
	];
</script>

<Fieldset legend="Restrictions & Limitations">
	<p class="hint">
		Indicate whether the following sensitive record categories should be excluded from the release.
	</p>

	<Alert type="warning" heading="Sensitive Information">
		<p>
			The following categories may require additional consent under applicable data protection laws.
			Select "Yes - Exclude" to prevent these records from being released.
		</p>
	</Alert>

	{#each rows as row (row.key)}
		<Field label={row.label}>
			<RadioGroup label={row.label}>
				{#each yesNoOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={row.name}
							value={opt.value}
							bind:group={r[row.key]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Additional restrictions or limitations" inputId="additionalRestrictions">
		<TextAreaInput
			id="additionalRestrictions"
			label="Additional restrictions or limitations"
			placeholder="Describe any other restrictions on the records release..."
			bind:value={r.additionalRestrictions}
		/>
	</Field>
</Fieldset>
