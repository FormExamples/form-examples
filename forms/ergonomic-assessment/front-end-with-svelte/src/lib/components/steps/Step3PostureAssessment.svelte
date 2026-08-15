<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const p = assessment.data.postureAssessment;
</script>

<Fieldset title="Posture Assessment" description="REBA body region scoring">
	<Select
		label="Sitting Posture"
		name="sittingPosture"
		options={[
			{ value: 'upright', label: 'Upright (good posture)' },
			{ value: 'slouched', label: 'Slouched' },
			{ value: 'leaning-forward', label: 'Leaning forward' },
			{ value: 'reclined', label: 'Reclined' }
		]}
		bind:value={p.sittingPosture}
	/>

	<Select
		label="Standing Posture"
		name="standingPosture"
		options={[
			{ value: 'upright', label: 'Upright (balanced)' },
			{ value: 'leaning', label: 'Leaning to one side' },
			{ value: 'asymmetric', label: 'Asymmetric weight bearing' },
			{ value: 'not-applicable', label: 'Not applicable (seated work)' }
		]}
		bind:value={p.standingPosture}
	/>

	<Select
		label="Neck Angle"
		name="neckAngle"
		options={[
			{ value: 'neutral', label: 'Neutral (0 degrees)' },
			{ value: 'flexed-0-20', label: 'Flexed 0-20 degrees' },
			{ value: 'flexed-20-plus', label: 'Flexed >20 degrees' },
			{ value: 'extended', label: 'Extended (looking up)' },
			{ value: 'twisted', label: 'Twisted or side-bending' }
		]}
		bind:value={p.neckAngle}
	/>

	<Select
		label="Trunk Angle"
		name="trunkAngle"
		options={[
			{ value: 'neutral', label: 'Neutral (upright)' },
			{ value: 'flexed-0-20', label: 'Flexed 0-20 degrees' },
			{ value: 'flexed-20-60', label: 'Flexed 20-60 degrees' },
			{ value: 'flexed-60-plus', label: 'Flexed >60 degrees' },
			{ value: 'twisted', label: 'Twisted or side-bending' }
		]}
		bind:value={p.trunkAngle}
	/>

	<Select
		label="Shoulder Position"
		name="shoulderPos"
		options={[
			{ value: 'neutral', label: 'Neutral (relaxed)' },
			{ value: 'raised', label: 'Raised / hunched' },
			{ value: 'abducted', label: 'Abducted (arms out)' },
			{ value: 'flexed', label: 'Flexed forward' }
		]}
		bind:value={p.shoulderPosition}
	/>

	<Select
		label="Wrist Deviation"
		name="wristDev"
		options={[
			{ value: 'neutral', label: 'Neutral' },
			{ value: 'flexed', label: 'Flexed (bent down)' },
			{ value: 'extended', label: 'Extended (bent up)' },
			{ value: 'ulnar-deviated', label: 'Ulnar deviation (pinky side)' },
			{ value: 'radial-deviated', label: 'Radial deviation (thumb side)' }
		]}
		bind:value={p.wristDeviation}
	/>

	<div class="mt-4 rounded-lg border border-info/30 bg-info/10 p-4">
		<h3 class="mb-3 text-sm font-semibold text-info">REBA Regional Scores (optional clinician input)</h3>
		<div class="grid grid-cols-2 gap-x-4 sm:grid-cols-3">
			<NumberInput label="Neck Score" name="neckScore" bind:value={p.neckScore} min={1} max={6} />
			<NumberInput label="Trunk Score" name="trunkScore" bind:value={p.trunkScore} min={1} max={6} />
			<NumberInput label="Leg Score" name="legScore" bind:value={p.legScore} min={1} max={4} />
			<NumberInput label="Upper Arm Score" name="upperArmScore" bind:value={p.upperArmScore} min={1} max={6} />
			<NumberInput label="Lower Arm Score" name="lowerArmScore" bind:value={p.lowerArmScore} min={1} max={3} />
			<NumberInput label="Wrist Score" name="wristScore" bind:value={p.wristScore} min={1} max={4} />
		</div>
	</div>
</Fieldset>
