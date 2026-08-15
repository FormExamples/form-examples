<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';

	const reassessments = $derived(assessment.data.reassessments);
	const canAdd = $derived(reassessments.length < 3);

	function add() {
		assessment.addReassessment();
	}

	function remove(index: number) {
		assessment.removeReassessment(index);
	}
</script>

<Fieldset
	title="Reassessment"
	description="Up to 3 reassessment vital sign sets recorded during transport."
>
	{#if reassessments.length === 0}
		<p class="mb-4 text-sm text-base-content/70">No reassessments recorded yet.</p>
	{/if}

	{#each reassessments as r, idx (idx)}
		<div class="mb-4 rounded-lg border border-base-300 bg-base-200 p-4">
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-base font-semibold text-base-content">Reassessment #{idx + 1}</h3>
				<button
					type="button"
					onclick={() => remove(idx)}
					class="rounded-md border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium text-base-content/80 hover:bg-base-200"
				>
					Remove
				</button>
			</div>

			<TextInput
				label="Time (24h)"
				name="reassess-time-{idx}"
				type="time"
				bind:value={r.time}
			/>

			<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
				<NumberInput
					label="HR"
					name="reassess-hr-{idx}"
					bind:value={r.hr}
					unit="bpm"
					min={0}
					max={300}
				/>
				<NumberInput
					label="RR"
					name="reassess-rr-{idx}"
					bind:value={r.rr}
					unit="/min"
					min={0}
					max={80}
				/>
				<NumberInput
					label="Temp"
					name="reassess-temp-{idx}"
					bind:value={r.tempC}
					unit="°C"
					step={0.1}
					min={25}
					max={45}
				/>
				<NumberInput
					label="SpO2"
					name="reassess-spo2-{idx}"
					bind:value={r.spo2}
					unit="%"
					min={0}
					max={100}
				/>
				<TextInput
					label="SpO2 on (e.g. RA, NC 2L)"
					name="reassess-spo2on-{idx}"
					bind:value={r.spo2OnOxygen}
				/>
				<NumberInput
					label="RBS"
					name="reassess-rbs-{idx}"
					bind:value={r.rbs}
					unit="mmol/L"
					step={0.1}
					min={0}
					max={50}
				/>
				<NumberInput
					label="Pain"
					name="reassess-pain-{idx}"
					bind:value={r.pain}
					unit="0–10"
					min={0}
					max={10}
				/>
			</div>

			<Checkbox
				label="Unchanged"
				name="reassess-unchanged-{idx}"
				bind:checked={r.unchanged}
			/>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		disabled={!canAdd}
		class="rounded-lg border border-primary bg-base-100 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-info/10 disabled:cursor-not-allowed disabled:border-base-300 disabled:text-base-content/60 disabled:hover:bg-base-100"
	>
		+ Add reassessment{#if !canAdd} (max 3 reached){/if}
	</button>
</Fieldset>
