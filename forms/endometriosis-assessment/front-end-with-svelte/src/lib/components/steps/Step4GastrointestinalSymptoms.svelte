<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const g = assessment.data.gastrointestinalSymptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const fields: { key: keyof typeof g; label: string }[] = [
		{ key: 'bloating', label: 'Bloating?' },
		{ key: 'nausea', label: 'Nausea?' },
		{ key: 'constipation', label: 'Constipation?' },
		{ key: 'diarrhoea', label: 'Diarrhoea?' },
		{ key: 'alternatingBowelHabit', label: 'Alternating bowel habit?' },
		{ key: 'rectalBleeding', label: 'Rectal bleeding?' },
		{ key: 'bowelObstructionSymptoms', label: 'Bowel obstruction symptoms (severe pain, vomiting, no bowel movements)?' }
	];
</script>

<Fieldset legend="Gastrointestinal Symptoms">
	<p class="hint">Bowel-related symptoms that may indicate deep infiltrating endometriosis.</p>

	<Field label="Do you have any GI symptoms?">
		<RadioGroup label="Do you have any GI symptoms?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasGiSymptoms" value={opt.value} bind:group={g.hasGiSymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#each fields as f (f.key)}
		<Field label={f.label}>
			<RadioGroup label={f.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={f.key} value={opt.value} bind:group={g[f.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	{#if g.bloating === 'yes'}
		<Field label="Is the bloating cyclical (worse during periods)?">
			<RadioGroup label="Cyclical bloating?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="bloatingCyclical" value={opt.value} bind:group={g.bloatingCyclical} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	{#if g.rectalBleeding === 'yes'}
		<Field label="Is the rectal bleeding cyclical (worse during periods)?">
			<RadioGroup label="Cyclical rectal bleeding?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="rectalBleedingCyclical" value={opt.value} bind:group={g.rectalBleedingCyclical} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="GI notes" inputId="giNotes">
		<TextAreaInput id="giNotes" label="GI notes" rows={2} bind:value={g.giNotes} />
	</Field>
</Fieldset>
