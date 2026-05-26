<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const g = assessment.data.gaitAssessment;
	const score01 = [{ value: '0', label: '0' }, { value: '1', label: '1' }];
	const score02 = [{ value: '0', label: '0' }, { value: '1', label: '1' }, { value: '2', label: '2' }];

	function toTinettiScore(val: string): 0 | 1 | 2 | null {
		if (val === '') return null;
		return Number(val) as 0 | 1 | 2;
	}
	function fromTinettiScore(val: 0 | 1 | 2 | null): string {
		return val === null ? '' : String(val);
	}

	let initiationOfGait = $state(fromTinettiScore(g.initiationOfGait));
	let stepLength = $state(fromTinettiScore(g.stepLength));
	let stepHeight = $state(fromTinettiScore(g.stepHeight));
	let stepSymmetry = $state(fromTinettiScore(g.stepSymmetry));
	let stepContinuity = $state(fromTinettiScore(g.stepContinuity));
	let path = $state(fromTinettiScore(g.path));
	let trunk = $state(fromTinettiScore(g.trunk));
	let walkingStance = $state(fromTinettiScore(g.walkingStance));

	$effect(() => { g.initiationOfGait = toTinettiScore(initiationOfGait); });
	$effect(() => { g.stepLength = toTinettiScore(stepLength); });
	$effect(() => { g.stepHeight = toTinettiScore(stepHeight); });
	$effect(() => { g.stepSymmetry = toTinettiScore(stepSymmetry); });
	$effect(() => { g.stepContinuity = toTinettiScore(stepContinuity); });
	$effect(() => { g.path = toTinettiScore(path); });
	$effect(() => { g.trunk = toTinettiScore(trunk); });
	$effect(() => { g.walkingStance = toTinettiScore(walkingStance); });

	const items: { name: string; label: string; opts: typeof score01; binding: 'initiationOfGait' | 'stepLength' | 'stepHeight' | 'stepSymmetry' | 'stepContinuity' | 'path' | 'trunk' | 'walkingStance' }[] = [
		{ name: 'initiationOfGait', label: '1. Initiation of Gait (0 = hesitancy, 1 = no hesitancy)', opts: score01, binding: 'initiationOfGait' },
		{ name: 'stepLength', label: '2. Step Length (0 = does not pass, 1 = passes)', opts: score01, binding: 'stepLength' },
		{ name: 'stepHeight', label: '3. Step Height (0 = does not clear, 1 = clears)', opts: score01, binding: 'stepHeight' },
		{ name: 'stepSymmetry', label: '4. Step Symmetry (0 = unequal, 1 = equal)', opts: score01, binding: 'stepSymmetry' },
		{ name: 'stepContinuity', label: '5. Step Continuity (0 = stopping, 1 = continuous)', opts: score01, binding: 'stepContinuity' },
		{ name: 'path', label: '6. Path (0 = marked deviation, 1 = mild/uses aid, 2 = straight)', opts: score02, binding: 'path' },
		{ name: 'trunk', label: '7. Trunk (0 = marked sway, 1 = no sway but flexion, 2 = no sway)', opts: score02, binding: 'trunk' },
		{ name: 'walkingStance', label: '8. Walking Stance (0 = heels apart, 1 = heels touching)', opts: score01, binding: 'walkingStance' }
	];

	function setValue(binding: typeof items[number]['binding'], v: string) {
		if (binding === 'initiationOfGait') initiationOfGait = v;
		else if (binding === 'stepLength') stepLength = v;
		else if (binding === 'stepHeight') stepHeight = v;
		else if (binding === 'stepSymmetry') stepSymmetry = v;
		else if (binding === 'stepContinuity') stepContinuity = v;
		else if (binding === 'path') path = v;
		else if (binding === 'trunk') trunk = v;
		else if (binding === 'walkingStance') walkingStance = v;
	}
	function getValue(binding: typeof items[number]['binding']): string {
		if (binding === 'initiationOfGait') return initiationOfGait;
		if (binding === 'stepLength') return stepLength;
		if (binding === 'stepHeight') return stepHeight;
		if (binding === 'stepSymmetry') return stepSymmetry;
		if (binding === 'stepContinuity') return stepContinuity;
		if (binding === 'path') return path;
		if (binding === 'trunk') return trunk;
		return walkingStance;
	}
</script>

<Fieldset legend="Gait Assessment (Tinetti)">
	<p class="hint">Tinetti Gait Test - 8 items, maximum 12 points.</p>

	{#each items as item (item.name)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each item.opts as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={item.name} value={opt.value} checked={getValue(item.binding) === opt.value} onchange={() => setValue(item.binding, opt.value)} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
