<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { emptyDiscrepancy } from '#lib/engine/utils.js';
	import type { Discrepancy } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import ListEditor from '#lib/components/ui/ListEditor.svelte';
	import LiveStatus from '#lib/components/LiveStatus.svelte';

	const data = assessment.data;
</script>

<Fieldset legend="Step 6 of 7 — Reconciliation">
	<p class="hint">
		One row per discrepancy between the BPMH and the inpatient list. Mark each intentional (with an
		action and rationale) or unintentional (an outstanding error).
	</p>

	<ListEditor
		bind:items={data.discrepancies}
		factory={emptyDiscrepancy}
		singular="Discrepancy"
		addLabel="+ Add discrepancy"
		emptyText="No discrepancies added. Add one row per difference between the BPMH and the inpatient list."
	>
		{#snippet row(item: Discrepancy)}
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Type</span>
				<Select label="Discrepancy type" bind:value={item.discrepancyType}>
					<option value="">— Select —</option>
					<option value="omission">Omission</option>
					<option value="commission">Commission</option>
					<option value="duplication">Duplication</option>
					<option value="dose">Dose</option>
					<option value="frequency">Frequency</option>
					<option value="route">Route</option>
					<option value="formulation">Formulation</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Intended action</span>
				<Select label="Intended action" bind:value={item.intendedAction}>
					<option value="">— Select —</option>
					<option value="continue">Continue</option>
					<option value="hold">Hold</option>
					<option value="stop">Stop</option>
					<option value="change">Change</option>
					<option value="start">Start</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Matched BPMH item</span>
				<TextInput
					label="Matched BPMH item"
					placeholder="e.g. Warfarin 3 mg"
					bind:value={item.bpmhItemRef}
				/>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Matched inpatient item</span>
				<TextInput
					label="Matched inpatient item"
					placeholder="e.g. Warfarin (held)"
					bind:value={item.inpatientItemRef}
				/>
			</label>
			<label class="list-cell block sm:col-span-2">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Rationale</span>
				<TextInput
					label="Rationale"
					placeholder="e.g. Held pre-operatively"
					bind:value={item.rationale}
				/>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80"
					>Intentional (documented decision)?</span
				>
				<Select label="Intentional" bind:value={item.intentional}>
					<option value="">— Select —</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</Select>
			</label>
		{/snippet}
	</ListEditor>

	<div class="mt-4">
		<LiveStatus />
	</div>
</Fieldset>
