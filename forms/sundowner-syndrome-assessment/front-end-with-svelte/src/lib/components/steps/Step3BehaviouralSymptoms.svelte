<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		cmaiItems,
		cmaiScaleOptions,
		npiDomains,
		npiFrequencyOptions,
		npiSeverityOptions
	} from '#lib/engine/cmai-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const b = assessment.data.behaviouralSymptoms;
</script>

<Fieldset legend="Behavioural Symptoms">
	<p class="hint">
		Cohen-Mansfield Agitation Inventory (CMAI): rate each behaviour 1 (never) to 7 (several times an
		hour) over the past two weeks.
	</p>

	<div class="cmai-grid">
		{#each cmaiItems as item (item.id)}
			<div class="cmai-row">
				<label class="cmai-label" for={`cmai-${item.id}`}>{item.number}. {item.label}</label>
				<select id={`cmai-${item.id}`} class="select" aria-label={item.label} bind:value={b.cmai[item.id]}>
					<option value={0}>-- Not rated --</option>
					{#each cmaiScaleOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
		{/each}
	</div>

	<p class="hint mt-6">
		Neuropsychiatric Inventory (NPI): for each domain, record frequency (1-4) and severity (1-3). The
		domain score is frequency × severity.
	</p>

	<div class="npi-list">
		{#each npiDomains as domain (domain.key)}
			<div class="npi-row">
				<div class="npi-meta">
					<span class="npi-name">{domain.label}</span>
					<span class="npi-desc">{domain.description}</span>
				</div>
				<div class="npi-controls">
					<select
						class="select"
						aria-label={`${domain.label} frequency`}
						bind:value={b.npi[domain.key].frequency}
					>
						<option value={0}>Frequency --</option>
						{#each npiFrequencyOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
					<select
						class="select"
						aria-label={`${domain.label} severity`}
						bind:value={b.npi[domain.key].severity}
					>
						<option value={0}>Severity --</option>
						{#each npiSeverityOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>
			</div>
		{/each}
	</div>

	<Field class="mt-6" label="Behavioural notes" inputId="behaviouralNotes">
		<TextAreaInput id="behaviouralNotes" label="Behavioural notes" rows={3} bind:value={b.behaviouralNotes} />
	</Field>
</Fieldset>

<style>
	.cmai-grid {
		display: grid;
		gap: 0.75rem;
	}
	.cmai-row {
		display: grid;
		grid-template-columns: 1fr 16rem;
		align-items: center;
		gap: 0.75rem;
	}
	.cmai-label {
		font-size: 0.9rem;
	}
	.npi-list {
		display: grid;
		gap: 1rem;
	}
	.npi-row {
		display: grid;
		grid-template-columns: 1fr 24rem;
		gap: 0.75rem;
		align-items: start;
	}
	.npi-meta {
		display: flex;
		flex-direction: column;
	}
	.npi-name {
		font-weight: 600;
		font-size: 0.95rem;
	}
	.npi-desc {
		font-size: 0.8rem;
		color: var(--color-muted);
	}
	.npi-controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}
	.mt-6 {
		margin-top: 1.5rem;
	}
	@media (max-width: 640px) {
		.cmai-row,
		.npi-row {
			grid-template-columns: 1fr;
		}
	}
</style>
