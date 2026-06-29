<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const hp = assessment.data.hormoneProfile;
</script>

<Fieldset legend="Hormone Profile">
	<p class="hint">Recent hormone results (leave blank if not yet done).</p>

	<div class="field-grid">
		<Field label="FSH (day 2/3) — IU/L" inputId="hormoneProfile-fsh">
			<NumberInput id="hormoneProfile-fsh" label="FSH" min={0} max={200} step={0.1} bind:value={hp.fsh} />
		</Field>
		<Field label="LH (day 2/3) — IU/L" inputId="hormoneProfile-lh">
			<NumberInput id="hormoneProfile-lh" label="LH" min={0} max={200} step={0.1} bind:value={hp.lh} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="AMH — pmol/L" inputId="hormoneProfile-amh">
			<NumberInput id="hormoneProfile-amh" label="AMH" min={0} max={200} step={0.01} bind:value={hp.amh} />
		</Field>
		<Field label="Oestradiol — pmol/L" inputId="hormoneProfile-oestradiol">
			<NumberInput id="hormoneProfile-oestradiol" label="Oestradiol" min={0} max={5000} step={1} bind:value={hp.oestradiol} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="TSH — mIU/L" inputId="hormoneProfile-tsh">
			<NumberInput id="hormoneProfile-tsh" label="TSH" min={0} max={100} step={0.01} bind:value={hp.tsh} />
		</Field>
		<Field label="Prolactin — mIU/L" inputId="hormoneProfile-prolactin">
			<NumberInput id="hormoneProfile-prolactin" label="Prolactin" min={0} max={10000} step={1} bind:value={hp.prolactin} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Testosterone — nmol/L" inputId="hormoneProfile-testosterone">
			<NumberInput id="hormoneProfile-testosterone" label="Testosterone" min={0} max={100} step={0.1} bind:value={hp.testosterone} />
		</Field>
		<Field label="Day-21 progesterone — nmol/L" inputId="hormoneProfile-progesteroneDay21">
			<NumberInput id="hormoneProfile-progesteroneDay21" label="Day-21 progesterone" min={0} max={200} step={0.1} bind:value={hp.progesteroneDay21} />
		</Field>
	</div>

	<Field label="Hormone test date" inputId="hormoneProfile-hormoneTestDate">
		<DateInput id="hormoneProfile-hormoneTestDate" label="Hormone test date" bind:value={hp.hormoneTestDate} />
	</Field>

	<Field label="Hormone profile notes" inputId="hormoneProfile-hormoneNotes">
		<TextAreaInput id="hormoneProfile-hormoneNotes" label="Hormone profile notes" rows={3} bind:value={hp.hormoneNotes} />
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
