<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const g = assessment.data.gastrointestinal;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Gastrointestinal">
	<p class="hint">Stomach and digestive conditions</p>
	<Field label="Do you suffer from acid reflux / GORD?"><RadioGroup label="Do you suffer from acid reflux / GORD?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="gord" value={opt.value} bind:group={g.gord}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Do you have a hiatus hernia?"><RadioGroup label="Do you have a hiatus hernia?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hiatus" value={opt.value} bind:group={g.hiatusHernia}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Do you often feel nauseous or vomit?"><RadioGroup label="Do you often feel nauseous or vomit?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="nausea" value={opt.value} bind:group={g.nausea}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
