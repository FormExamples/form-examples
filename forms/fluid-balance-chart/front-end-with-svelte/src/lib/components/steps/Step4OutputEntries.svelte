<script lang="ts">
	import { assessment, createDefaultEntry } from '#lib/stores/assessment.svelte.js';
	import { calculateGrade } from '#lib/engine/fluid-balance-grader.js';
	import { OUTPUT_CATEGORIES, categoryLabel, fluidStatusLabel, fluidStatusColor, formatSignedMl } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const d = assessment.data;
	const grade = $derived(calculateGrade(assessment.data));

	function addOutput() {
		d.output.push(createDefaultEntry());
	}
	function removeOutput(i: number) {
		d.output.splice(i, 1);
	}
</script>

<Fieldset legend="Step 4 of 5 — Output entries">
	<p class="hint">
		One row per recorded output volume: urine, drains, vomit / NG, stool, or insensible / other. Add
		each with its time, category, description, and volume in mL.
	</p>

	{#if d.output.length === 0}
		<p class="hint">No output entries added yet. Add one row per recorded output volume.</p>
	{/if}

	{#each d.output as row, i (i)}
		<div class="repeating-row">
			<div class="repeating-row-header">
				<h4 class="repeating-row-title">Output {i + 1}</h4>
				<Button data-variant="danger" label={`Remove output entry ${i + 1}`} onclick={() => removeOutput(i)}>
					Remove
				</Button>
			</div>

			<Field label="Time recorded" inputId={`output-${i}-entryAt`}>
				<TextInput
					id={`output-${i}-entryAt`}
					label="Time recorded"
					type="datetime-local"
					class="date-input"
					bind:value={row.entryAt}
				/>
			</Field>

			<Field label="Category" inputId={`output-${i}-category`}>
				<Select id={`output-${i}-category`} label="Category" bind:value={row.category}>
					<option value="">— Select —</option>
					{#each OUTPUT_CATEGORIES as cat (cat)}
						<option value={cat}>{categoryLabel(cat)}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Description" inputId={`output-${i}-description`}>
				<TextInput
					id={`output-${i}-description`}
					label="Description"
					placeholder="e.g. Urinary catheter"
					bind:value={row.description}
				/>
			</Field>

			<Field label="Volume (mL)" inputId={`output-${i}-volumeMl`}>
				<NumberInput id={`output-${i}-volumeMl`} label="Volume (mL)" min={0} step={1} bind:value={row.volumeMl} />
			</Field>
		</div>
	{/each}

	<Button data-variant="secondary" onclick={addOutput}>+ Add output entry</Button>

	<Field label="Live balance and status">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {fluidStatusColor(grade.fluidStatus)}">
				{fluidStatusLabel(grade.fluidStatus)}
			</span>
			<strong class="text-base-content">Output {grade.totalOutputMl} mL</strong>
			<span class="text-base-content/70">Intake {grade.totalIntakeMl} mL</span>
			<span class="text-base-content/70">Net {formatSignedMl(grade.netBalanceMl)} over {grade.hoursObserved} h</span>
		</span>
	</Field>
</Fieldset>
