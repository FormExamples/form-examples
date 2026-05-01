<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const pe = assessment.data.physicalExam;

	const systems: { key: keyof typeof pe; label: string }[] = [
		{ key: 'general', label: 'General' },
		{ key: 'heent', label: 'HEENT' },
		{ key: 'respiratory', label: 'Respiratory' },
		{ key: 'cardiac', label: 'Cardiac' },
		{ key: 'abdominal', label: 'Abdominal' },
		{ key: 'pelvisGu', label: 'Pelvis / GU' },
		{ key: 'neurologic', label: 'Neurologic' },
		{ key: 'psychiatric', label: 'Psychiatric' },
		{ key: 'musculoskeletal', label: 'Musculoskeletal (MSK)' },
		{ key: 'skin', label: 'Skin' }
	];
</script>

<SectionCard
	title="Physical Exam"
	description="Tick Normal or note findings for each body system."
>
	{#each systems as sys (sys.key)}
		<div class="mb-4 border-b border-gray-100 pb-3">
			<h3 class="mb-2 text-base font-semibold text-gray-800">{sys.label}</h3>
			<Checkbox
				label="Normal (NML)"
				name="pe-{sys.key}-normal"
				bind:checked={pe[sys.key].normal}
			/>
			<TextArea
				label="Notes"
				name="pe-{sys.key}-notes"
				bind:value={pe[sys.key].notes}
				rows={2}
			/>
		</div>
	{/each}
</SectionCard>
