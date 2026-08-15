<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const n = assessment.data.nihssAssessment;

	const items = [
		{ key: 'consciousness', label: '1a. Level of Consciousness', opts: [
			{ value: '0', label: '0 - Alert' },
			{ value: '1', label: '1 - Not alert, arousable' },
			{ value: '2', label: '2 - Not alert, requires repeated stimulation' },
			{ value: '3', label: '3 - Unresponsive' }
		] },
		{ key: 'consciousnessQuestions', label: '1b. LOC Questions (month, age)', opts: [
			{ value: '0', label: '0 - Both correct' },
			{ value: '1', label: '1 - One correct' },
			{ value: '2', label: '2 - Neither correct' }
		] },
		{ key: 'consciousnessCommands', label: '1c. LOC Commands', opts: [
			{ value: '0', label: '0 - Both correct' },
			{ value: '1', label: '1 - One correct' },
			{ value: '2', label: '2 - Neither correct' }
		] },
		{ key: 'gaze', label: '2. Best Gaze', opts: [
			{ value: '0', label: '0 - Normal' },
			{ value: '1', label: '1 - Partial gaze palsy' },
			{ value: '2', label: '2 - Forced deviation' }
		] },
		{ key: 'visual', label: '3. Visual Fields', opts: [
			{ value: '0', label: '0 - No visual loss' },
			{ value: '1', label: '1 - Partial hemianopia' },
			{ value: '2', label: '2 - Complete hemianopia' },
			{ value: '3', label: '3 - Bilateral hemianopia' }
		] },
		{ key: 'facialPalsy', label: '4. Facial Palsy', opts: [
			{ value: '0', label: '0 - Normal' },
			{ value: '1', label: '1 - Minor paralysis' },
			{ value: '2', label: '2 - Partial paralysis' },
			{ value: '3', label: '3 - Complete paralysis' }
		] },
		{ key: 'motorLeftArm', label: '5a. Motor Arm - Left', opts: [
			{ value: '0', label: '0 - No drift' },
			{ value: '1', label: '1 - Drift before 10s' },
			{ value: '2', label: '2 - Falls before 10s' },
			{ value: '3', label: '3 - No effort against gravity' },
			{ value: '4', label: '4 - No movement' }
		] },
		{ key: 'motorRightArm', label: '5b. Motor Arm - Right', opts: [
			{ value: '0', label: '0 - No drift' },
			{ value: '1', label: '1 - Drift before 10s' },
			{ value: '2', label: '2 - Falls before 10s' },
			{ value: '3', label: '3 - No effort against gravity' },
			{ value: '4', label: '4 - No movement' }
		] },
		{ key: 'motorLeftLeg', label: '6a. Motor Leg - Left', opts: [
			{ value: '0', label: '0 - No drift' },
			{ value: '1', label: '1 - Drift before 5s' },
			{ value: '2', label: '2 - Falls before 5s' },
			{ value: '3', label: '3 - No effort against gravity' },
			{ value: '4', label: '4 - No movement' }
		] },
		{ key: 'motorRightLeg', label: '6b. Motor Leg - Right', opts: [
			{ value: '0', label: '0 - No drift' },
			{ value: '1', label: '1 - Drift before 5s' },
			{ value: '2', label: '2 - Falls before 5s' },
			{ value: '3', label: '3 - No effort against gravity' },
			{ value: '4', label: '4 - No movement' }
		] },
		{ key: 'limbAtaxia', label: '7. Limb Ataxia', opts: [
			{ value: '0', label: '0 - Absent' },
			{ value: '1', label: '1 - One limb' },
			{ value: '2', label: '2 - Two limbs' }
		] },
		{ key: 'sensory', label: '8. Sensory', opts: [
			{ value: '0', label: '0 - Normal' },
			{ value: '1', label: '1 - Mild-to-moderate loss' },
			{ value: '2', label: '2 - Severe or total loss' }
		] },
		{ key: 'language', label: '9. Best Language', opts: [
			{ value: '0', label: '0 - Normal' },
			{ value: '1', label: '1 - Mild-to-moderate aphasia' },
			{ value: '2', label: '2 - Severe aphasia' },
			{ value: '3', label: '3 - Mute/global aphasia' }
		] },
		{ key: 'dysarthria', label: '10. Dysarthria', opts: [
			{ value: '0', label: '0 - Normal' },
			{ value: '1', label: '1 - Mild-to-moderate' },
			{ value: '2', label: '2 - Severe/unintelligible/mute' }
		] },
		{ key: 'extinctionInattention', label: '11. Extinction and Inattention', opts: [
			{ value: '0', label: '0 - No abnormality' },
			{ value: '1', label: '1 - Inattention to one modality' },
			{ value: '2', label: '2 - Profound neglect' }
		] }
	] as const;

	function valueAsString(key: typeof items[number]['key']): string {
		const v = (n as unknown as Record<string, number | null>)[key];
		return v === null || v === undefined ? '' : String(v);
	}

	function setValue(key: typeof items[number]['key'], v: string) {
		(n as unknown as Record<string, number | null>)[key] = v === '' ? null : Number(v);
	}
</script>

<Fieldset legend="NIHSS Assessment">
	<p class="hint">National Institutes of Health Stroke Scale (0-42). Score each item. Higher scores indicate greater neurological deficit.</p>

	{#each items as item (item.key)}
		<Field label={item.label} inputId={`nihss-${item.key}`}>
			<select
				class="select"
				id={`nihss-${item.key}`}
				aria-label={item.label}
				value={valueAsString(item.key)}
				onchange={(e) => setValue(item.key, (e.currentTarget as HTMLSelectElement).value)}
			>
				<option value="">-- Select --</option>
				{#each item.opts as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</Field>
	{/each}
</Fieldset>
