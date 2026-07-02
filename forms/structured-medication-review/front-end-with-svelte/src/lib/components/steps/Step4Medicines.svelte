<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { emptyMedicine } from '$lib/engine/utils';
	import type { Medicine } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import ListEditor from '$lib/components/ui/ListEditor.svelte';
	import LiveStatus from '$lib/components/LiveStatus.svelte';

	const data = assessment.data;
</script>

<Fieldset legend="Step 4 of 8 — Medicines">
	<p class="hint">
		One row per medicine reviewed. Record each medicine with its indication, adherence,
		anticholinergic burden (0-3), monitoring, and any STOPP or START criterion.
	</p>

	<ListEditor
		bind:items={data.medicines}
		factory={emptyMedicine}
		singular="Medicine"
		addLabel="+ Add medicine"
		emptyText="No medicines added yet. Add one row per medicine reviewed."
	>
		{#snippet row(item: Medicine)}
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Medicine name</span>
				<TextInput label="Medicine name" placeholder="e.g. Amitriptyline" bind:value={item.drugName} />
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Form and strength</span>
				<TextInput label="Form and strength" placeholder="e.g. Tablet 10 mg" bind:value={item.formStrength} />
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Dose and regimen</span>
				<TextInput label="Dose and regimen" placeholder="e.g. One at night" bind:value={item.doseRegimen} />
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Indication</span>
				<TextInput label="Indication" placeholder="e.g. Neuropathic pain" bind:value={item.indication} />
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Indication recorded?</span>
				<Select label="Indication recorded?" bind:value={item.indicationRecorded}>
					<option value="">— Select —</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Regular medicine?</span>
				<Select label="Regular medicine?" bind:value={item.isRegular}>
					<option value="">— Select —</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">High-risk medicine?</span>
				<Select label="High-risk medicine?" bind:value={item.isHighRisk}>
					<option value="">— Select —</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">High-risk class</span>
				<Select label="High-risk class" bind:value={item.highRiskClass}>
					<option value="">— Select —</option>
					<option value="anticoagulant">Anticoagulant</option>
					<option value="insulin">Insulin</option>
					<option value="opioid">Opioid</option>
					<option value="dmard">DMARD</option>
					<option value="lithium">Lithium</option>
					<option value="methotrexate">Methotrexate</option>
					<option value="other">Other</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Adherence</span>
				<Select label="Adherence" bind:value={item.adherence}>
					<option value="">— Select —</option>
					<option value="good">Good</option>
					<option value="partial">Partial</option>
					<option value="poor">Poor</option>
					<option value="unknown">Unknown</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80"
					>Anticholinergic burden (0-3)</span
				>
				<NumberInput
					label="Anticholinergic burden points"
					min={0}
					max={3}
					step={1}
					bind:value={item.anticholinergicBurdenPoints}
				/>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Monitoring required?</span>
				<Select label="Monitoring required?" bind:value={item.monitoringRequired}>
					<option value="">— Select —</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Monitoring up to date?</span>
				<Select label="Monitoring up to date?" bind:value={item.monitoringUpToDate}>
					<option value="">— Select —</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
					<option value="na">Not applicable</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Deprescribing candidate?</span>
				<Select label="Deprescribing candidate?" bind:value={item.deprescribingCandidate}>
					<option value="">— Select —</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">STOPP criterion</span>
				<TextInput
					label="STOPP criterion"
					placeholder="e.g. STOPP D5 — TCA with dementia"
					bind:value={item.stoppCriterion}
				/>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">START criterion</span>
				<TextInput
					label="START criterion"
					placeholder="e.g. START A6 — statin in diabetes"
					bind:value={item.startCriterion}
				/>
			</label>
		{/snippet}
	</ListEditor>

	<div class="mt-4">
		<LiveStatus />
	</div>
</Fieldset>
