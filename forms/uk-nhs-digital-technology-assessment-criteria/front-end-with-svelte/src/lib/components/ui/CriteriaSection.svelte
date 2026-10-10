<script lang="ts">
	// CriteriaSection — one DTAC section (A-G): a radio group per criterion,
	// generated from the criteria catalogue, plus a section notes box.
	import { RadioGroup, TextAreaInput } from '@lilydesignsystem/svelte-headless';
	import { store } from '#lib/stores/assessment.svelte.js';
	import { CRITERIA, SECTIONS } from '#lib/engine/criteria.js';
	import Field from './Field.svelte';
	import Fieldset from './Fieldset.svelte';

	let { section, step }: { section: string; step: number } = $props();

	const meta = $derived(SECTIONS.find((s) => s.id === section));
	const items = $derived(CRITERIA.filter((c) => c.section === section));

	const options = [
		{ value: 'met', label: 'Met' },
		{ value: 'partially-met', label: 'Partially met' },
		{ value: 'not-met', label: 'Not met' },
		{ value: 'not-applicable', label: 'Not applicable' }
	];
</script>

<Fieldset legend={`Step ${step} — Section ${section.toUpperCase()}: ${meta?.title ?? ''}`}>
	{#each items as c (c.id)}
		<Field
			label={`${c.id.toUpperCase()} (${c.mandatory ? 'mandatory' : 'advisory'}) — ${c.description}`}
		>
			<RadioGroup label={`${c.id.toUpperCase()} ${c.description}`}>
				{#each options as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`criterion-${c.id}`}
							value={opt.value}
							bind:group={store.data.criteria[c.id]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
	<Field label={`Section ${section.toUpperCase()} notes`} class="field-span-2">
		<TextAreaInput
			label={`Section ${section.toUpperCase()} notes`}
			rows={3}
			bind:value={store.data.notes[section]}
		/>
	</Field>
</Fieldset>
