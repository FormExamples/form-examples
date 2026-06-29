<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.substitutionOptions;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Substitution Options">
	<p class="hint">Indicate whether alternatives are acceptable.</p>

	<Field label="Allow brand name substitution?">
		<RadioGroup label="Allow brand name substitution?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="allowBrand" value={opt.value} bind:group={s.allowBrandSubstitution} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Allow generic substitution?">
		<RadioGroup label="Allow generic substitution?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="allowGeneric" value={opt.value} bind:group={s.allowGenericSubstitution} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Allow dosage adjustment?">
		<RadioGroup label="Allow dosage adjustment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="allowDosage" value={opt.value} bind:group={s.allowDosageAdjustment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Substitution Notes" inputId="substitutionNotes">
		<TextAreaInput id="substitutionNotes" label="Substitution Notes" placeholder="Any additional notes about substitution preferences..." bind:value={s.substitutionNotes} />
	</Field>
</Fieldset>
