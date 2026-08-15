<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { emptySource } from '#lib/engine/utils.js';
	import type { InformationSource } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import ListEditor from '#lib/components/ui/ListEditor.svelte';
	import LiveStatus from '#lib/components/LiveStatus.svelte';

	const data = assessment.data;
</script>

<Fieldset legend="Step 3 of 7 — Information sources">
	<p class="hint">
		Each source used to build the best-possible medication history. Two or more independent sources
		are required.
	</p>

	<ListEditor
		bind:items={data.informationSources}
		factory={emptySource}
		singular="Source"
		addLabel="+ Add information source"
		emptyText="No sources added yet. Add each source used to build the BPMH (two or more required)."
	>
		{#snippet row(item: InformationSource)}
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Source type</span>
				<Select label="Source type" bind:value={item.sourceType}>
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
				<span class="mb-1 block text-sm font-medium text-base-content/80"
					>Verified (directly checked)?</span
				>
				<Select label="Verified" bind:value={item.verified}>
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
