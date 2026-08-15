<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { emptyLineItem } from '#lib/engine/utils.js';
	import type { LineItem } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import ListEditor from '#lib/components/ui/ListEditor.svelte';
	import LiveStatus from '#lib/components/LiveStatus.svelte';

	const data = assessment.data;
</script>

<Fieldset legend="Step 5 of 7 — Medication line items">
	<p class="hint">
		One row per medicine. Tag each as BPMH (a home medicine) or Inpatient / proposed. The BPMH and
		inpatient lists are reconciled in the next step.
	</p>

	<ListEditor
		bind:items={data.lineItems}
		factory={emptyLineItem}
		singular="Medicine"
		addLabel="+ Add medicine"
		emptyText="No medicines added yet. Add one row per BPMH or inpatient medicine."
	>
		{#snippet row(item: LineItem)}
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">List</span>
				<Select label="List" bind:value={item.listSource}>
					<option value="">— Select —</option>
					<option value="bpmh">BPMH (home medicine)</option>
					<option value="inpatient">Inpatient / proposed</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Medicine name</span>
				<TextInput label="Medicine name" placeholder="e.g. Warfarin" bind:value={item.drugName} />
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Form</span>
				<TextInput label="Form" placeholder="e.g. Tablet" bind:value={item.form} />
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Dose</span>
				<TextInput label="Dose" placeholder="e.g. 3 mg" bind:value={item.dose} />
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Route</span>
				<Select label="Route" bind:value={item.route}>
					<option value="">— Select —</option>
					<option value="oral">Oral</option>
					<option value="iv">Intravenous</option>
					<option value="im">Intramuscular</option>
					<option value="subcutaneous">Subcutaneous</option>
					<option value="topical">Topical</option>
					<option value="inhaled">Inhaled</option>
					<option value="other">Other</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Frequency</span>
				<TextInput label="Frequency" placeholder="e.g. Once daily" bind:value={item.frequency} />
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Indication</span>
				<TextInput
					label="Indication"
					placeholder="e.g. Atrial fibrillation"
					bind:value={item.indication}
				/>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">High-risk class</span>
				<Select label="High-risk class" bind:value={item.highRiskClass}>
					<option value="">— Select —</option>
					<option value="none">None</option>
					<option value="anticoagulant">Anticoagulant</option>
					<option value="insulin">Insulin</option>
					<option value="opioid">Opioid</option>
					<option value="other">Other</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Adherence</span>
				<Select label="Adherence" bind:value={item.adherence}>
					<option value="">— Select —</option>
					<option value="taking">Taking</option>
					<option value="not-taking">Not taking</option>
					<option value="intermittent">Intermittent</option>
					<option value="unknown">Unknown</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Information source</span>
				<Select label="Information source" bind:value={item.sourceType}>
					<option value="">— Select —</option>
					<option value="patient-interview">Patient interview</option>
					<option value="carer-interview">Carer interview</option>
					<option value="gp-record">GP record</option>
					<option value="repeat-prescription">Repeat-prescription list</option>
					<option value="community-pharmacy">Community-pharmacy record</option>
					<option value="dispensing-history">Dispensing history</option>
					<option value="previous-discharge-summary">Previous discharge summary</option>
					<option value="own-drugs-bag">Patient's own-drugs bag</option>
					<option value="care-home-mar">Care-home MAR chart</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Inpatient status</span>
				<Select label="Inpatient status" bind:value={item.status}>
					<option value="">— Select —</option>
					<option value="active">Active</option>
					<option value="held">Held</option>
					<option value="stopped">Stopped</option>
					<option value="suspended">Suspended</option>
				</Select>
			</label>
		{/snippet}
	</ListEditor>

	<div class="mt-4">
		<LiveStatus />
	</div>
</Fieldset>
