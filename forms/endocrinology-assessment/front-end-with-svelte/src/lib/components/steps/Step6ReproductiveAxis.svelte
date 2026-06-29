<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.reproductiveAxis;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const radios = [
		{ key: 'menstrualIrregularity', label: 'Menstrual irregularity' },
		{ key: 'infertility', label: 'Infertility concern' },
		{ key: 'libidoChange', label: 'Libido change' },
		{ key: 'galactorrhoea', label: 'Galactorrhoea' }
	] as const;
</script>

<Fieldset legend="Reproductive Axis">
	<p class="hint">Gonadotropins and sex steroids; FSH/LH &gt;25 IU/L suggests primary gonadal failure.</p>

	<div class="field-grid">
		<Field label="FSH (IU/L)" inputId="fsh">
			<NumberInput id="fsh" label="FSH" step="0.1" min={0} bind:value={r.fsh} />
		</Field>
		<Field label="LH (IU/L)" inputId="lh">
			<NumberInput id="lh" label="LH" step="0.1" min={0} bind:value={r.lh} />
		</Field>
		<Field label="Testosterone (nmol/L)" inputId="testosterone">
			<NumberInput id="testosterone" label="Testosterone" step="0.1" min={0} bind:value={r.testosterone} />
		</Field>
		<Field label="Oestradiol (pmol/L)" inputId="oestradiol">
			<NumberInput id="oestradiol" label="Oestradiol" min={0} bind:value={r.oestradiol} />
		</Field>
	</div>

	{#each radios as item (item.key)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={item.key} value={opt.value} bind:group={r[item.key]} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Reproductive notes" inputId="reproductiveNotes">
		<TextAreaInput id="reproductiveNotes" label="Reproductive notes" rows={3} bind:value={r.reproductiveNotes} />
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
