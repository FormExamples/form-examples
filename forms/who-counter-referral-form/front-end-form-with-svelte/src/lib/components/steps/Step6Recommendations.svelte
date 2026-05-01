<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const r = assessment.data.recommendations;
</script>

<SectionCard
	title="Recommendations"
	description="The fourth part of the SBAR framework. Follow-up plan, pending investigations, deterioration instructions, and status flags."
>
	<TextArea
		label="Next steps in follow-up plan"
		name="followUpPlan"
		bind:value={r.followUpPlan}
		rows={4}
		required
	/>

	<TextArea
		label="Pending investigations (results awaited)"
		name="pendingInvestigations"
		bind:value={r.pendingInvestigations}
		rows={3}
		placeholder="List any results that are not yet available."
	/>

	<TextArea
		label="Follow-up arrangements (when, where, with whom)"
		name="followUpArrangements"
		bind:value={r.followUpArrangements}
		rows={3}
		required
	/>

	<TextArea
		label="Instructions if patient's condition deteriorates"
		name="deteriorationInstructions"
		bind:value={r.deteriorationInstructions}
		rows={3}
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Contact for follow-up questions</h3>
	<TextInput
		label="Contact name"
		name="contactName"
		bind:value={r.contactName}
		required
	/>
	<TextInput
		label="Contact information"
		name="contactInformation"
		bind:value={r.contactInformation}
		placeholder="Phone, email, etc."
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Status flags</h3>
	<p class="mb-3 text-xs text-gray-500">Tick any that apply to this patient.</p>
	<Checkbox
		label="Cognitive impairment"
		name="cognitiveImpairment"
		bind:checked={r.statusFlags.cognitiveImpairment}
	/>
	<Checkbox
		label="Carer-dependent"
		name="carerDependent"
		bind:checked={r.statusFlags.carerDependent}
	/>
	<Checkbox
		label="Spinal precautions"
		name="spinalPrecautions"
		bind:checked={r.statusFlags.spinalPrecautions}
	/>
	<Checkbox
		label="Weight-bearing restrictions"
		name="weightBearingRestrictions"
		bind:checked={r.statusFlags.weightBearingRestrictions}
	/>
	<Checkbox
		label="Palliative care"
		name="palliativeCare"
		bind:checked={r.statusFlags.palliativeCare}
	/>
</SectionCard>
