<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const rf = assessment.data.riskFactors;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const questions = [
		{ field: 'pretermUnder38', label: 'Gestational age below 38 weeks?' },
		{
			field: 'previousSiblingJaundice',
			label: 'Previous sibling required phototherapy or had neonatal jaundice?'
		},
		{ field: 'exclusiveBreastfeeding', label: 'Exclusively breastfed?' },
		{ field: 'bruising', label: 'Significant bruising or cephalohaematoma?' },
		{
			field: 'bloodGroupIncompatibility',
			label: 'Blood-group incompatibility (ABO / Rhesus) or positive DAT (Coombs)?'
		},
		{ field: 'earlyOnsetUnder24h', label: 'Jaundice onset before 24 hours of age?' }
	] as const;
</script>

<Fieldset legend="Step 4 of 5 — Risk factors">
	<p class="hint">
		Recognised factors that lower the effective concern threshold and warrant earlier / closer
		assessment. Jaundice within 24 hours is pathological until proven otherwise.
	</p>

	{#each questions as q (q.field)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`riskFactors-${q.field}`}
							value={opt.value}
							bind:group={rf[q.field]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
