<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Panel from '#lib/components/ui/Panel.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { bandColor, bandShortLabel, recommendationCopy } from '#lib/engine/utils.js';

	const grade = $derived(assessment.grade);
	const bandClass = $derived(bandColor(grade.computedBand));

	let signedBy = $state('');
</script>

<Fieldset legend="6. Score &amp; sign-off">
	<Panel label="Computed readiness score" class="score-panel">
		<div class="score-grid">
			<div class="score-cell">
				<div class="score-number">{grade.scoreTotal}</div>
				<div class="score-caption">/ 16 total</div>
			</div>
			<div class="score-cell">
				<div class="score-number">{grade.manifestoSubtotal}</div>
				<div class="score-caption">/ 4 manifesto</div>
			</div>
			<div class="score-cell">
				<div class="score-number">{grade.principlesSubtotal}</div>
				<div class="score-caption">/ 12 principles</div>
			</div>
		</div>

		<div class="score-band">
			<Badge label={bandShortLabel(grade.computedBand)} color={bandClass} />
			<span class="score-recommendation">{recommendationCopy(grade.computedBand)}</span>
		</div>
	</Panel>

	{#if grade.additionalFlags.length > 0}
		<Alert type="warning" heading="Readiness flags">
			<ul class="flag-list">
				{#each grade.additionalFlags as flag (flag.flagId)}
					<li>
						<strong>{flag.category}</strong>
						<span class="flag-priority">({flag.priority})</span>
						<div>{flag.description}</div>
						<div class="flag-action"><strong>Suggested action:</strong> {flag.suggestedAction}</div>
					</li>
				{/each}
			</ul>
		</Alert>
	{/if}

	<Field label="Signed by" inputId="signedBy" description="Enter your name to sign off this scorecard.">
		<TextInput id="signedBy" label="Signed by" placeholder="Your name" bind:value={signedBy} />
	</Field>
</Fieldset>

<style>
	.score-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		text-align: center;
	}
	.score-cell {
		border: 1px solid var(--color-base-300, currentColor);
		border-radius: 0.375rem;
		padding: 0.75rem;
	}
	.score-number {
		font-size: 1.875rem;
		font-weight: 700;
		line-height: 1;
	}
	.score-caption {
		font-size: 0.75rem;
		opacity: 0.7;
		margin-top: 0.25rem;
	}
	.score-band {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}
	.score-recommendation {
		font-size: 0.875rem;
		opacity: 0.85;
	}
	.flag-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}
	.flag-priority {
		font-size: 0.75rem;
		opacity: 0.7;
	}
	.flag-action {
		font-size: 0.75rem;
		opacity: 0.8;
		margin-top: 0.25rem;
	}
</style>
