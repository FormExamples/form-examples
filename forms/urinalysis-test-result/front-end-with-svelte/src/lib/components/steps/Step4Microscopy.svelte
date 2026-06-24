<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Microscopy">
	<p class="hint">Microscopy counts and observed elements (free-text as reported).</p>

	<Field label="Red cell count" inputId="redCellCount">
		<TextInput
			id="redCellCount"
			label="Red cell count"
			placeholder="e.g. <10 x10^6/L"
			bind:value={d.redCellCount}
		/>
	</Field>

	<Field label="White cell count" inputId="whiteCellCount">
		<TextInput
			id="whiteCellCount"
			label="White cell count"
			placeholder="e.g. >100 x10^6/L (pyuria)"
			bind:value={d.whiteCellCount}
		/>
	</Field>

	<Field label="Epithelial cells" inputId="epithelialCells">
		<TextInput
			id="epithelialCells"
			label="Epithelial cells"
			placeholder="e.g. few / numerous (raised suggests contamination)"
			bind:value={d.epithelialCells}
		/>
	</Field>

	<Field label="Casts" inputId="casts">
		<TextInput
			id="casts"
			label="Casts"
			placeholder="e.g. hyaline, granular, red-cell casts"
			bind:value={d.casts}
		/>
	</Field>

	<Field label="Crystals" inputId="crystals">
		<TextInput
			id="crystals"
			label="Crystals"
			placeholder="e.g. calcium oxalate, urate"
			bind:value={d.crystals}
		/>
	</Field>

	<Field label="Organisms">
		<CheckboxGroup label="Organisms">
			<label>
				<CheckboxInput label="Organisms (bacteria) seen on microscopy" bind:checked={d.organismsSeen} /> Organisms
				(bacteria) seen on microscopy
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
