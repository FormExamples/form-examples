<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const e = assessment.data.exposure;
</script>

<SectionCard
	title="Exposure (E)"
	description="Primary survey: exposure assessment. Additional exam findings are captured under Physical Exam."
>
	<Checkbox label="Normal (NML)" name="exposureNormal" bind:checked={e.normal} />
	<Checkbox
		label="Exposed completely"
		name="exposedCompletely"
		bind:checked={e.exposedCompletely}
	/>
	<TextArea label="Notes" name="exposureNotes" bind:value={e.notes} rows={3} />
</SectionCard>
