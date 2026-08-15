<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const u = assessment.data.urinarySymptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const fields: { key: keyof typeof u; label: string }[] = [
		{ key: 'frequency', label: 'Urinary frequency?' },
		{ key: 'urgency', label: 'Urinary urgency?' },
		{ key: 'dysuria', label: 'Dysuria (painful urination)?' },
		{ key: 'haematuria', label: 'Haematuria (blood in urine)?' },
		{ key: 'flankPain', label: 'Flank pain?' },
		{ key: 'urinaryObstructionSymptoms', label: 'Urinary obstruction symptoms (inability to pass urine)?' },
		{ key: 'recurrentUtis', label: 'Recurrent urinary tract infections?' }
	];
</script>

<Fieldset legend="Urinary Symptoms">
	<p class="hint">Bladder-related symptoms that may indicate urinary tract endometriosis.</p>

	<Field label="Do you have any urinary symptoms?">
		<RadioGroup label="Do you have any urinary symptoms?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasUrinarySymptoms" value={opt.value} bind:group={u.hasUrinarySymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#each fields as f (f.key)}
		<Field label={f.label}>
			<RadioGroup label={f.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={f.key} value={opt.value} bind:group={u[f.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	{#if u.haematuria === 'yes'}
		<Field label="Is the haematuria cyclical (worse during periods)?">
			<RadioGroup label="Cyclical haematuria?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="haematuriaCyclical" value={opt.value} bind:group={u.haematuriaCyclical} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Urinary notes" inputId="urinaryNotes">
		<TextAreaInput id="urinaryNotes" label="Urinary notes" rows={2} bind:value={u.urinaryNotes} />
	</Field>
</Fieldset>
