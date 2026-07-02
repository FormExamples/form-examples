<script lang="ts">
	import { assessment, createDefaultEntry } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/fluid-balance-grader';
	import { INTAKE_CATEGORIES, categoryLabel, fluidStatusLabel, fluidStatusColor, formatSignedMl } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const d = assessment.data;
	const grade = $derived(calculateGrade(assessment.data));

	function addIntake() {
		d.intake.push(createDefaultEntry());
	}
	function removeIntake(i: number) {
		d.intake.splice(i, 1);
	}
</script>

<Fieldset legend="Step 3 of 5 — Intake entries">
	<p class="hint">
		One row per recorded intake volume: oral, IV, enteral, blood / products, or other. Add each with
		its time, category, route, and volume in mL.
	</p>

	{#if d.intake.length === 0}
		<p class="hint">No intake entries added yet. Add one row per recorded intake volume.</p>
	{/if}

	{#each d.intake as row, i (i)}
		<div class="repeating-row">
			<div class="repeating-row-header">
				<h4 class="repeating-row-title">Intake {i + 1}</h4>
				<Button data-variant="danger" label={`Remove intake entry ${i + 1}`} onclick={() => removeIntake(i)}>
					Remove
				</Button>
			</div>

			<Field label="Time recorded" inputId={`intake-${i}-entryAt`}>
				<TextInput
					id={`intake-${i}-entryAt`}
					label="Time recorded"
					type="datetime-local"
					class="date-input"
					bind:value={row.entryAt}
				/>
			</Field>

			<Field label="Category" inputId={`intake-${i}-category`}>
				<Select id={`intake-${i}-category`} label="Category" bind:value={row.category}>
					<option value="">— Select —</option>
					{#each INTAKE_CATEGORIES as cat (cat)}
						<option value={cat}>{categoryLabel(cat)}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Route / description" inputId={`intake-${i}-description`}>
				<TextInput
					id={`intake-${i}-description`}
					label="Route / description"
					placeholder="e.g. Peripheral cannula, 0.9% saline"
					bind:value={row.description}
				/>
			</Field>

			<Field label="Volume (mL)" inputId={`intake-${i}-volumeMl`}>
				<NumberInput id={`intake-${i}-volumeMl`} label="Volume (mL)" min={0} step={1} bind:value={row.volumeMl} />
			</Field>
		</div>
	{/each}

	<Button data-variant="secondary" onclick={addIntake}>+ Add intake entry</Button>

	<Field label="Live balance and status">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {fluidStatusColor(grade.fluidStatus)}">
				{fluidStatusLabel(grade.fluidStatus)}
			</span>
			<strong class="text-base-content">Intake {grade.totalIntakeMl} mL</strong>
			<span class="text-base-content/70">Output {grade.totalOutputMl} mL</span>
			<span class="text-base-content/70">Net {formatSignedMl(grade.netBalanceMl)} over {grade.hoursObserved} h</span>
		</span>
	</Field>
</Fieldset>
