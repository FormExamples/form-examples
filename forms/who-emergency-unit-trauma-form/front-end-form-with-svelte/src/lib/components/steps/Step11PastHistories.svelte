<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const h = assessment.data.pastHistories;
</script>

<SectionCard
	title="Past Histories"
	description="Past medical, medications, past surgeries and family history."
>
	<h3 class="mb-2 text-base font-semibold text-gray-800">Past medical</h3>
	<Checkbox label="None" name="pmhNone" bind:checked={h.pmhNone} />
	<Checkbox label="Unknown" name="pmhUnknown" bind:checked={h.pmhUnknown} />
	<Checkbox label="HTN (hypertension)" name="pmhHtn" bind:checked={h.pmhHtn} />
	<Checkbox label="DM (diabetes mellitus)" name="pmhDm" bind:checked={h.pmhDm} />
	<Checkbox label="COPD" name="pmhCopd" bind:checked={h.pmhCopd} />
	<Checkbox label="Psychiatric" name="pmhPsych" bind:checked={h.pmhPsych} />
	<Checkbox label="Renal disease" name="pmhRenalDisease" bind:checked={h.pmhRenalDisease} />
	<TextArea label="Other past medical" name="pmhOther" bind:value={h.pmhOther} rows={2} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Medications</h3>
	<Checkbox label="None" name="medicationsNone" bind:checked={h.medicationsNone} />
	<Checkbox label="Unknown" name="medicationsUnknown" bind:checked={h.medicationsUnknown} />
	<TextArea label="Medications list" name="medications" bind:value={h.medications} rows={3} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Past surgeries</h3>
	<Checkbox label="None" name="pastSurgeriesNone" bind:checked={h.pastSurgeriesNone} />
	<Checkbox label="Unknown" name="pastSurgeriesUnknown" bind:checked={h.pastSurgeriesUnknown} />
	<TextArea label="Past surgeries (type & date)" name="pastSurgeries" bind:value={h.pastSurgeries} rows={2} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Family history</h3>
	<Checkbox label="None" name="familyHistoryNone" bind:checked={h.familyHistoryNone} />
	<Checkbox label="Unknown" name="familyHistoryUnknown" bind:checked={h.familyHistoryUnknown} />
	<TextArea label="Family history" name="familyHistory" bind:value={h.familyHistory} rows={2} />
</SectionCard>
