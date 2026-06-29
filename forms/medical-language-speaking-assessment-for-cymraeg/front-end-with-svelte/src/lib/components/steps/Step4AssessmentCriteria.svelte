<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { linguisticCriteria, clinicalCriteria, LINGUISTIC_ANCHORS, CLINICAL_ANCHORS } from '$lib/engine/rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import type { LinguisticRating, ClinicalIndicators } from '$lib/engine/types';

	const rp1 = assessment.data.linguisticRolePlay1;
	const rp2 = assessment.data.linguisticRolePlay2;
	const ci = assessment.data.clinicalIndicators;

	const ling = linguisticCriteria();
	const clin = clinicalCriteria();

	type LingField = keyof LinguisticRating;
	type ClinField = Exclude<keyof ClinicalIndicators, 'examinerNotes'>;
</script>

<Fieldset legend="Graddio meini prawf / Assessment criteria rating">
	<p class="hint">
		Linguistic criteria are rated 0-6 (CEFR-mapped) for each role-play. Clinical communication
		indicators are rated 0-3 once for the whole assessment.
	</p>

	<h3 class="group-title">Linguistic criteria (0-6, per role-play)</h3>
	{#each ling as c (c.id)}
		{@const field = c.dataField as LingField}
		<div class="criterion">
			<div class="criterion-head">
				<span class="criterion-label">{c.label}</span>
				<span class="criterion-desc">{c.description}</span>
			</div>

			<div class="rating-row">
				<span class="rating-caption">Role-play 1</span>
				<fieldset class="radio-group rating-scale" role="radiogroup" aria-label={`${c.label} — role-play 1`}>
					{#each LINGUISTIC_ANCHORS as a (a.value)}
						<label class="rating-option" title={a.description}>
							<input
								type="radio"
								class="radio-input"
								name={`rp1-${c.id}`}
								value={a.value}
								bind:group={rp1[field]}
							/>
							<span>{a.label}</span>
						</label>
					{/each}
				</fieldset>
			</div>

			<div class="rating-row">
				<span class="rating-caption">Role-play 2</span>
				<fieldset class="radio-group rating-scale" role="radiogroup" aria-label={`${c.label} — role-play 2`}>
					{#each LINGUISTIC_ANCHORS as a (a.value)}
						<label class="rating-option" title={a.description}>
							<input
								type="radio"
								class="radio-input"
								name={`rp2-${c.id}`}
								value={a.value}
								bind:group={rp2[field]}
							/>
							<span>{a.label}</span>
						</label>
					{/each}
				</fieldset>
			</div>
		</div>
	{/each}

	<h3 class="group-title">Clinical communication indicators (0-3)</h3>
	{#each clin as c (c.id)}
		{@const field = c.dataField as ClinField}
		<div class="criterion">
			<div class="criterion-head">
				<span class="criterion-label">{c.label}</span>
				<span class="criterion-desc">{c.description}</span>
			</div>
			<fieldset class="radio-group rating-scale" role="radiogroup" aria-label={c.label}>
				{#each CLINICAL_ANCHORS as a (a.value)}
					<label class="rating-option" title={a.description}>
						<input
							type="radio"
							class="radio-input"
							name={`clin-${c.id}`}
							value={a.value}
							bind:group={ci[field]}
						/>
						<span>{a.label}</span>
					</label>
				{/each}
			</fieldset>
		</div>
	{/each}
</Fieldset>

<style>
	.group-title {
		margin: 1.5rem 0 0.5rem;
		font-size: 1rem;
		font-weight: 600;
	}
	.criterion {
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-base-300, #ddd);
	}
	.criterion-head {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		margin-bottom: 0.5rem;
	}
	.criterion-label {
		font-weight: 600;
	}
	.criterion-desc {
		font-size: 0.8125rem;
		opacity: 0.7;
	}
	.rating-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 0.25rem 0;
		flex-wrap: wrap;
	}
	.rating-caption {
		min-width: 6rem;
		font-size: 0.8125rem;
		font-weight: 500;
		opacity: 0.8;
	}
	.rating-scale {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	.rating-option {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
