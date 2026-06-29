<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.adrenalAxis;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const radios = [
		{ key: 'hyperpigmentation', label: 'Hyperpigmentation' },
		{ key: 'cushingoidFeatures', label: 'Cushingoid features' },
		{ key: 'posturalHypotension', label: 'Postural hypotension' }
	] as const;
</script>

<Fieldset legend="Adrenal Axis Review">
	<p class="hint">Morning cortisol 140–700 nmol/L · ACTH 2–11 pmol/L.</p>

	<div class="field-grid">
		<Field label="Morning cortisol (nmol/L)" inputId="morningCortisol">
			<NumberInput id="morningCortisol" label="Morning cortisol" min={0} bind:value={a.morningCortisol} />
		</Field>
		<Field label="ACTH (pmol/L)" inputId="acth">
			<NumberInput id="acth" label="ACTH" step="0.1" min={0} bind:value={a.acth} />
		</Field>
		<Field label="Aldosterone (pmol/L)" inputId="aldosterone">
			<NumberInput id="aldosterone" label="Aldosterone" min={0} bind:value={a.aldosterone} />
		</Field>
		<Field label="Renin (mIU/L)" inputId="renin">
			<NumberInput id="renin" label="Renin" step="0.1" min={0} bind:value={a.renin} />
		</Field>
	</div>

	{#each radios as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={a[r.key]} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Adrenal notes" inputId="adrenalNotes">
		<TextAreaInput id="adrenalNotes" label="Adrenal notes" rows={3} bind:value={a.adrenalNotes} />
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
</style>
