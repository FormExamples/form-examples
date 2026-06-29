<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RelativeEntry from '$lib/components/ui/RelativeEntry.svelte';
	import RelativeListEditor from '$lib/components/ui/RelativeListEditor.svelte';

	const fp = assessment.data.familyPedigree;
</script>

<Fieldset legend="Three-Generation Family Pedigree">
	<p class="hint">
		Document the proband's parents, siblings, children, grandparents, aunts/uncles and cousins.
		Add cancer details for each affected relative.
	</p>

	<h3 class="mt-4 text-sm font-semibold text-base-content">Maternal grandparents</h3>
	<div class="mt-2 space-y-3">
		<div class="rounded-lg border border-base-300 bg-base-100 p-3">
			<p class="mb-2 text-sm font-semibold text-base-content">Maternal grandmother</p>
			<RelativeEntry relative={fp.maternalGrandmother} />
		</div>
		<div class="rounded-lg border border-base-300 bg-base-100 p-3">
			<p class="mb-2 text-sm font-semibold text-base-content">Maternal grandfather</p>
			<RelativeEntry relative={fp.maternalGrandfather} />
		</div>
	</div>

	<h3 class="mt-4 text-sm font-semibold text-base-content">Paternal grandparents</h3>
	<div class="mt-2 space-y-3">
		<div class="rounded-lg border border-base-300 bg-base-100 p-3">
			<p class="mb-2 text-sm font-semibold text-base-content">Paternal grandmother</p>
			<RelativeEntry relative={fp.paternalGrandmother} />
		</div>
		<div class="rounded-lg border border-base-300 bg-base-100 p-3">
			<p class="mb-2 text-sm font-semibold text-base-content">Paternal grandfather</p>
			<RelativeEntry relative={fp.paternalGrandfather} />
		</div>
	</div>

	<h3 class="mt-4 text-sm font-semibold text-base-content">Parents</h3>
	<div class="mt-2 space-y-3">
		<div class="rounded-lg border border-base-300 bg-base-100 p-3">
			<p class="mb-2 text-sm font-semibold text-base-content">Mother</p>
			<RelativeEntry relative={fp.mother} />
		</div>
		<div class="rounded-lg border border-base-300 bg-base-100 p-3">
			<p class="mb-2 text-sm font-semibold text-base-content">Father</p>
			<RelativeEntry relative={fp.father} />
		</div>
	</div>

	<RelativeListEditor
		bind:relatives={fp.maternalAuntsUncles}
		label="Maternal aunts and uncles"
		hint="Mother's siblings."
		addLabel="Add maternal aunt/uncle"
		defaultRelation="Maternal aunt/uncle"
		side="maternal"
		generation={2}
	/>
	<RelativeListEditor
		bind:relatives={fp.paternalAuntsUncles}
		label="Paternal aunts and uncles"
		hint="Father's siblings."
		addLabel="Add paternal aunt/uncle"
		defaultRelation="Paternal aunt/uncle"
		side="paternal"
		generation={2}
	/>
	<RelativeListEditor
		bind:relatives={fp.siblings}
		label="Siblings"
		hint="Brothers and sisters of the proband (full and half)."
		addLabel="Add sibling"
		defaultRelation="Sibling"
		side="self"
		generation={3}
	/>
	<RelativeListEditor
		bind:relatives={fp.children}
		label="Children"
		addLabel="Add child"
		defaultRelation="Child"
		side="self"
		generation={3}
	/>
	<RelativeListEditor
		bind:relatives={fp.maternalCousins}
		label="Maternal cousins"
		addLabel="Add maternal cousin"
		defaultRelation="Maternal cousin"
		side="maternal"
		generation={3}
	/>
	<RelativeListEditor
		bind:relatives={fp.paternalCousins}
		label="Paternal cousins"
		addLabel="Add paternal cousin"
		defaultRelation="Paternal cousin"
		side="paternal"
		generation={3}
	/>
</Fieldset>
