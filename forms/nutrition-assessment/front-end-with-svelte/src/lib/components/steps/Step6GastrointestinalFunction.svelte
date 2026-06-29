<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const g = assessment.data.gastrointestinalFunction;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Gastrointestinal Function">
	<p class="hint">Symptoms that may interfere with appetite, intake, or nutrient absorption.</p>

	<Field label="Nausea?">
		<RadioGroup label="Nausea">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nausea" value={opt.value} bind:group={g.nausea} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Vomiting?">
		<RadioGroup label="Vomiting">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vomiting" value={opt.value} bind:group={g.vomiting} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Diarrhoea?">
		<RadioGroup label="Diarrhoea">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diarrhea" value={opt.value} bind:group={g.diarrhea} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Constipation?">
		<RadioGroup label="Constipation">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="constipation" value={opt.value} bind:group={g.constipation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Abdominal pain?">
		<RadioGroup label="Abdominal pain">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="abdominalPain" value={opt.value} bind:group={g.abdominalPain} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Bloating?">
		<RadioGroup label="Bloating">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bloating" value={opt.value} bind:group={g.bloating} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Reflux / heartburn?">
		<RadioGroup label="Reflux">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="reflux" value={opt.value} bind:group={g.reflux} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Early satiety (feeling full quickly)?">
		<RadioGroup label="Early satiety">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="earlysatiety" value={opt.value} bind:group={g.earlysatiety} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Bowel-habit notes" inputId="bowelHabitNotes">
		<TextAreaInput id="bowelHabitNotes" label="Bowel-habit notes" rows={3} placeholder="Frequency, consistency, recent changes…" bind:value={g.bowelHabitNotes} />
	</Field>
</Fieldset>
