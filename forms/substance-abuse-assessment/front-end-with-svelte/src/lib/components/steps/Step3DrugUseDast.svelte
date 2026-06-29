<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateDastScore, dastRiskLabel, dastRiskCategory } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.drugUseDast;

	const score = $derived(calculateDastScore(d));
	const category = $derived(dastRiskCategory(score));

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const questions: { key: keyof typeof d; name: string; label: string }[] = [
		{ key: 'dastQ1NonMedicalUse', name: 'dastQ1', label: '1. Have you used drugs other than those required for medical reasons?' },
		{ key: 'dastQ2PolyDrug', name: 'dastQ2', label: '2. Do you abuse more than one drug at a time?' },
		{ key: 'dastQ3AbleToStop', name: 'dastQ3', label: '3. Are you always able to stop using drugs when you want to? (a "No" answer scores)' },
		{ key: 'dastQ4Blackouts', name: 'dastQ4', label: '4. Have you had blackouts or flashbacks as a result of drug use?' },
		{ key: 'dastQ5Guilt', name: 'dastQ5', label: '5. Do you ever feel bad or guilty about your drug use?' },
		{ key: 'dastQ6Complaints', name: 'dastQ6', label: '6. Does your spouse (or parents) ever complain about your involvement with drugs?' },
		{ key: 'dastQ7Neglect', name: 'dastQ7', label: '7. Have you neglected your family because of your use of drugs?' },
		{ key: 'dastQ8IllegalActivities', name: 'dastQ8', label: '8. Have you engaged in illegal activities in order to obtain drugs?' },
		{ key: 'dastQ9Withdrawal', name: 'dastQ9', label: '9. Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?' },
		{ key: 'dastQ10MedicalProblems', name: 'dastQ10', label: '10. Have you had medical problems as a result of your drug use (e.g. memory loss, hepatitis, convulsions, bleeding)?' }
	];
</script>

<Fieldset legend="Drug Use (DAST-10)">
	<p class="hint">
		Drug Abuse Screening Test (DAST-10). Refers to the use of prescribed or over-the-counter drugs
		in excess of directions and any non-medical use of drugs. The total (0-10) determines the risk
		band.
	</p>

	{#each questions as q (q.name)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={q.name} value={opt.value} bind:group={d[q.key]} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<div class="score-box">
		<strong>DAST-10 score:</strong> {score}/10 — {dastRiskLabel(category)}
	</div>
</Fieldset>

<style>
	.score-box {
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-base-300, #d1d5db);
		border-radius: 0.5rem;
	}
</style>
