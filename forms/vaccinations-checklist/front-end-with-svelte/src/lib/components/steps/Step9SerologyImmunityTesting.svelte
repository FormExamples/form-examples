<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.serologyImmunityTesting;
	const generic = s as unknown as Record<string, string>;

	type Opt = { value: string; label: string };
	const posNeg: Opt[] = [
		{ value: 'positive', label: 'Positive' },
		{ value: 'negative', label: 'Negative' },
		{ value: 'not-tested', label: 'Not tested' }
	];
	const posNegEquiv: Opt[] = [
		{ value: 'positive', label: 'Positive' },
		{ value: 'negative', label: 'Negative' },
		{ value: 'equivocal', label: 'Equivocal' },
		{ value: 'not-tested', label: 'Not tested' }
	];
	const igraOpts: Opt[] = [
		{ value: 'positive', label: 'Positive' },
		{ value: 'negative', label: 'Negative' },
		{ value: 'indeterminate', label: 'Indeterminate' },
		{ value: 'not-tested', label: 'Not tested' }
	];

	const serology: { key: string; dateKey: string; label: string; opts: Opt[] }[] = [
		{ key: 'varicellaIgG', dateKey: 'varicellaIgGDate', label: 'Varicella IgG', opts: posNegEquiv },
		{ key: 'measlesIgG', dateKey: 'measlesIgGDate', label: 'Measles IgG', opts: posNegEquiv },
		{ key: 'rubellaIgG', dateKey: 'rubellaIgGDate', label: 'Rubella IgG', opts: posNegEquiv },
		{ key: 'mumpsIgG', dateKey: 'mumpsIgGDate', label: 'Mumps IgG', opts: posNegEquiv },
		{ key: 'hepAIgG', dateKey: 'hepAIgGDate', label: 'Hepatitis A IgG', opts: posNeg },
		{ key: 'tetanusAntibody', dateKey: 'tetanusAntibodyDate', label: 'Tetanus antibody', opts: posNeg },
		{ key: 'tbIGRAResult', dateKey: 'tbIGRADate', label: 'TB IGRA result', opts: igraOpts }
	];
</script>

<Fieldset legend="Serology & Immunity Testing">
	<p class="hint">Blood-test evidence of immunity.</p>

	<div class="vac-row">
		<Field label="Hepatitis B surface antibody" inputId="hepBSurfaceAb">
			<Select id="hepBSurfaceAb" label="Hepatitis B surface antibody" bind:value={s.hepBSurfaceAntibody}>
				<option value="">-- Select --</option>
				{#each posNeg as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
		</Field>
		{#if s.hepBSurfaceAntibody === 'positive' || s.hepBSurfaceAntibody === 'negative'}
			<div class="field-grid">
				<Field label="Level (mIU/mL)" inputId="hepBLevel">
					<NumberInput id="hepBLevel" label="Level" min={0} max={100000} bind:value={s.hepBSurfaceAntibodyLevel} />
				</Field>
				<Field label="Date" inputId="hepBDate">
					<DateInput id="hepBDate" label="Date" bind:value={s.hepBSurfaceAntibodyDate} />
				</Field>
			</div>
		{/if}
	</div>

	{#each serology as test (test.key)}
		<div class="vac-row">
			<Field label={test.label} inputId={test.key}>
				<Select id={test.key} label={test.label} bind:value={generic[test.key]}>
					<option value="">-- Select --</option>
					{#each test.opts as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</Select>
			</Field>
			{#if generic[test.key] && generic[test.key] !== 'not-tested'}
				<Field label="Date" inputId={`${test.key}-date`}>
					<DateInput id={`${test.key}-date`} label={`${test.label} date`} bind:value={generic[test.dateKey]} />
				</Field>
			{/if}
		</div>
	{/each}

	<div class="vac-row">
		<Field label="Mantoux result" inputId="mantoux">
			<Select id="mantoux" label="Mantoux result" bind:value={s.mantouxResult}>
				<option value="">-- Select --</option>
				{#each posNeg as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
		</Field>
		{#if s.mantouxResult === 'positive' || s.mantouxResult === 'negative'}
			<Field label="Induration (mm)" inputId="mantouxMm">
				<NumberInput id="mantouxMm" label="Induration (mm)" min={0} max={100} bind:value={s.mantouxIndurationMm} />
			</Field>
		{/if}
	</div>

	<Field label="Notes" inputId="serologyNotes">
		<TextAreaInput id="serologyNotes" label="Notes" rows={2} bind:value={s.notes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
	.vac-row {
		border-bottom: 1px solid var(--color-base-300, #e5e7eb);
		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
	}
</style>
