<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.sceneSafety;
	const tri = [
		{ value: 'yes', label: 'Demonstrated' },
		{ value: 'no', label: 'Not yet' },
		{ value: 'na', label: 'Not assessed' }
	];
	const items = [
		{ name: 'sceneSafe', label: 'Confirms the scene is safe before approaching the casualty.' },
		{ name: 'ppeApplied', label: 'Applies appropriate personal protective equipment (PPE).' },
		{ name: 'hazardsIdentified', label: 'Identifies and mitigates environmental hazards.' },
		{ name: 'bystandersControlled', label: 'Manages bystanders so they do not impede care.' }
	] as const;
</script>

<Fieldset legend="Scene Safety & Initial Assessment">
	<p class="hint">Mark each observed skill as demonstrated, not yet demonstrated, or not assessed.</p>

	{#each items as item (item.name)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each tri as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.name} value={opt.value} bind:group={d[item.name]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
