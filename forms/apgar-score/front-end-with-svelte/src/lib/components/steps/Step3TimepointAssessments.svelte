<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateApgarGrade } from '$lib/engine/apgar-grader';
	import { SIGNS } from '$lib/engine/apgar-rules';
	import { bandLabel, bandColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// Grade the whole assessment reactively so each timepoint shows a live total.
	const graded = $derived(calculateApgarGrade(assessment.data).timepoints);
</script>

<Fieldset legend="Step 3 of 4 — Timepoint assessments">
	<p class="hint">
		Score the five signs (each 0-2) at 1 and 5 minutes, and again at 10 minutes and beyond whenever
		the 5-minute total is below 7.
	</p>

	{#if assessment.data.timepoints.length === 0}
		<p class="hint">No timepoints recorded. Add the 1-minute and 5-minute scores to begin.</p>
	{/if}

	{#each assessment.data.timepoints as tp, index (index)}
		<div class="mb-6 rounded-lg border border-base-300 bg-base-100 p-4">
			<div class="mb-3 flex items-center justify-between gap-3">
				<h3 class="text-base font-semibold text-base-content">Timepoint {index + 1}</h3>
				{#if graded[index]?.scored}
					<span
						class="inline-block rounded-full border px-3 py-1 text-xs font-bold {bandColor(graded[index].band)}"
					>
						{graded[index].total} of 10 — {bandLabel(graded[index].band)}
					</span>
				{:else}
					<span class="text-xs text-base-content/60">Not yet scored</span>
				{/if}
			</div>

			<Field
				label="Timepoint (minutes after birth)"
				inputId={`tp-${index}-minutes`}
			>
				<NumberInput
					id={`tp-${index}-minutes`}
					label="Timepoint in minutes after birth"
					min={0}
					max={60}
					step={1}
					bind:value={tp.timepointMinutes}
				/>
			</Field>

			{#each SIGNS as sign (sign.field)}
				<Field label={`${sign.letter} · ${sign.label}`} inputId={`tp-${index}-${sign.field}`}>
					<Select
						id={`tp-${index}-${sign.field}`}
						label={`${sign.label} score`}
						bind:value={tp[sign.field]}
					>
						<option value="">— Select —</option>
						<option value="0">0 — {sign.scores['0']}</option>
						<option value="1">1 — {sign.scores['1']}</option>
						<option value="2">2 — {sign.scores['2']}</option>
					</Select>
				</Field>
			{/each}

			<div class="mt-2">
				<Button
					data-variant="danger"
					label={`Remove timepoint ${index + 1}`}
					onclick={() => assessment.removeTimepoint(index)}
				>
					Remove timepoint
				</Button>
			</div>
		</div>
	{/each}

	<Button data-variant="secondary" onclick={() => assessment.addTimepoint()}>
		+ Add timepoint
	</Button>
</Fieldset>
