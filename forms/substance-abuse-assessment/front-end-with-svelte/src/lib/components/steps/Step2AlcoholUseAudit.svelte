<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAuditScore, auditRiskLabel, auditRiskCategory } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';

	const a = assessment.data.alcoholUseAudit;

	const score = $derived(calculateAuditScore(a));
	const category = $derived(auditRiskCategory(score));

	// Standard AUDIT answer scales.
	const freqScale = [
		{ value: 0, label: 'Never' },
		{ value: 1, label: 'Less than monthly' },
		{ value: 2, label: 'Monthly' },
		{ value: 3, label: 'Weekly' },
		{ value: 4, label: 'Daily or almost daily' }
	];
	const yesScale = [
		{ value: 0, label: 'No' },
		{ value: 2, label: 'Yes, but not in the last year' },
		{ value: 4, label: 'Yes, during the last year' }
	];

	const questions: {
		key: keyof typeof a;
		id: string;
		label: string;
		options: { value: number; label: string }[];
	}[] = [
		{
			key: 'auditQ1Frequency',
			id: 'auditQ1',
			label: '1. How often do you have a drink containing alcohol?',
			options: [
				{ value: 0, label: 'Never' },
				{ value: 1, label: 'Monthly or less' },
				{ value: 2, label: '2-4 times a month' },
				{ value: 3, label: '2-3 times a week' },
				{ value: 4, label: '4 or more times a week' }
			]
		},
		{
			key: 'auditQ2TypicalQuantity',
			id: 'auditQ2',
			label: '2. How many drinks containing alcohol do you have on a typical day when drinking?',
			options: [
				{ value: 0, label: '1 or 2' },
				{ value: 1, label: '3 or 4' },
				{ value: 2, label: '5 or 6' },
				{ value: 3, label: '7 to 9' },
				{ value: 4, label: '10 or more' }
			]
		},
		{
			key: 'auditQ3BingeFrequency',
			id: 'auditQ3',
			label: '3. How often do you have six or more drinks on one occasion?',
			options: freqScale
		},
		{ key: 'auditQ4ImpairedControl', id: 'auditQ4', label: '4. How often during the last year have you found that you were not able to stop drinking once you had started?', options: freqScale },
		{ key: 'auditQ5FailedExpectations', id: 'auditQ5', label: '5. How often during the last year have you failed to do what was normally expected of you because of drinking?', options: freqScale },
		{ key: 'auditQ6MorningDrinking', id: 'auditQ6', label: '6. How often during the last year have you needed a first drink in the morning to get yourself going?', options: freqScale },
		{ key: 'auditQ7Guilt', id: 'auditQ7', label: '7. How often during the last year have you had a feeling of guilt or remorse after drinking?', options: freqScale },
		{ key: 'auditQ8Blackout', id: 'auditQ8', label: '8. How often during the last year have you been unable to remember what happened the night before because of drinking?', options: freqScale },
		{ key: 'auditQ9Injury', id: 'auditQ9', label: '9. Have you or someone else been injured because of your drinking?', options: yesScale },
		{ key: 'auditQ10Concern', id: 'auditQ10', label: '10. Has a relative, friend, doctor, or other health worker been concerned about your drinking or suggested you cut down?', options: yesScale }
	];
</script>

<Fieldset legend="Alcohol Use (AUDIT)">
	<p class="hint">
		WHO Alcohol Use Disorders Identification Test (AUDIT). Each item is scored; the total (0-40)
		determines the risk band.
	</p>

	{#each questions as q (q.id)}
		<Field label={q.label} inputId={q.id}>
			<select class="select" id={q.id} aria-label={q.label} bind:value={a[q.key]}>
				{#each q.options as opt (opt.value)}
					<option value={opt.value}>{opt.label} ({opt.value})</option>
				{/each}
			</select>
		</Field>
	{/each}

	<div class="score-box">
		<strong>AUDIT score:</strong> {score}/40 — {auditRiskLabel(category)}
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
