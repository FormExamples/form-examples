<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const o = assessment.data.obstetricHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

	const prevs: { key: 'preeclampsia' | 'gestationalDiabetes' | 'pretermBirth' | 'cesareanSection'; name: string; label: string }[] = [
		{ key: 'preeclampsia', name: 'prevPreeclampsia', label: 'Previous preeclampsia' },
		{ key: 'gestationalDiabetes', name: 'prevGDM', label: 'Previous gestational diabetes' },
		{ key: 'pretermBirth', name: 'prevPreterm', label: 'Previous preterm birth (before 37 weeks)' },
		{ key: 'cesareanSection', name: 'prevCesarean', label: 'Previous cesarean section' }
	];
</script>

<Fieldset legend="Obstetric History">
	<p class="hint">Previous pregnancies and complications.</p>

	<div class="field-grid">
		<Field label="Gravida (total pregnancies)" required inputId="gravida">
			<NumberInput id="gravida" label="Gravida" min={0} max={20} required bind:value={o.gravida} />
		</Field>
		<Field label="Para (births after 24 weeks)" required inputId="para">
			<NumberInput id="para" label="Para" min={0} max={20} required bind:value={o.para} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Abortions / Miscarriages" inputId="abortions">
			<NumberInput id="abortions" label="Abortions" min={0} max={20} bind:value={o.abortions} />
		</Field>
		<Field label="Living Children" inputId="livingChildren">
			<NumberInput id="livingChildren" label="Living children" min={0} max={20} bind:value={o.livingChildren} />
		</Field>
	</div>

	<h3 class="step-subhead">Previous Complications</h3>
	{#each prevs as p (p.key)}
		<Field label={p.label}>
			<RadioGroup label={p.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={p.name} value={opt.value} bind:group={o.previousComplications[p.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
	.step-subhead { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
</style>
