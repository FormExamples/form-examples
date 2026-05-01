<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const c = assessment.data.circulation;
</script>

<SectionCard
	title="C — Circulation"
	description="Circulation assessment and intervention."
>
	<h3 class="mb-2 text-base font-semibold text-gray-800">Assessment</h3>
	<Checkbox
		label="Normal — perfusion appears adequate"
		name="crNormal"
		bind:checked={c.assessmentNormal}
	/>
	<TextArea
		label="Findings (e.g. pulse, skin colour, capillary refill, minor bleeding)"
		name="crFindings"
		bind:value={c.assessmentFindings}
		rows={3}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Intervention</h3>
	<Checkbox
		label="Pelvic Binder"
		name="crPelvicBinder"
		bind:checked={c.interventions.pelvicBinder}
	/>
	<Checkbox
		label="Control minor bleeding"
		name="crMinorBleeding"
		bind:checked={c.interventions.controlMinorBleeding}
	/>
	<Checkbox
		label="Fracture Care"
		name="crFractureCare"
		bind:checked={c.interventions.fractureCare}
	/>
	<Checkbox
		label="Oral Hydration"
		name="crOralHydration"
		bind:checked={c.interventions.oralHydration}
	/>
	<Checkbox
		label="Lie down to improve circulation (left-lateral position)"
		name="crLeftLateral"
		bind:checked={c.interventions.leftLateralPosition}
	/>
	<Checkbox label="None" name="crNone" bind:checked={c.interventions.none} />
</SectionCard>
