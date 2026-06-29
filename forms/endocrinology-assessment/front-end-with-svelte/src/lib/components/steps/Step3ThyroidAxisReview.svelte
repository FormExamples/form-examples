<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.thyroidAxis;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const radios = [
		{ key: 'antibodiesPositive', label: 'Thyroid autoantibodies positive' },
		{ key: 'goitre', label: 'Goitre on examination' },
		{ key: 'familyHistoryThyroid', label: 'Family history of thyroid disease' }
	] as const;
</script>

<Fieldset legend="Thyroid Axis Review">
	<p class="hint">TSH 0.4–4.0 mIU/L · FT4 9–25 pmol/L · FT3 3.5–6.5 pmol/L.</p>

	<div class="field-grid field-grid-3">
		<Field label="TSH (mIU/L)" inputId="tsh">
			<NumberInput id="tsh" label="TSH" step="0.01" min={0} bind:value={t.tsh} />
		</Field>
		<Field label="FT4 (pmol/L)" inputId="ft4">
			<NumberInput id="ft4" label="FT4" step="0.1" min={0} bind:value={t.ft4} />
		</Field>
		<Field label="FT3 (pmol/L)" inputId="ft3">
			<NumberInput id="ft3" label="FT3" step="0.1" min={0} bind:value={t.ft3} />
		</Field>
	</div>

	{#each radios as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={t[r.key]} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Thyroid notes" inputId="thyroidNotes">
		<TextAreaInput id="thyroidNotes" label="Thyroid notes" rows={3} bind:value={t.thyroidNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
