<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const b = assessment.data.balanceAssessment;
	const score01 = [{ value: '0', label: '0' }, { value: '1', label: '1' }];
	const score02 = [{ value: '0', label: '0' }, { value: '1', label: '1' }, { value: '2', label: '2' }];

	function toTinettiScore(val: string): 0 | 1 | 2 | null {
		if (val === '') return null;
		return Number(val) as 0 | 1 | 2;
	}
	function fromTinettiScore(val: 0 | 1 | 2 | null): string {
		return val === null ? '' : String(val);
	}

	let sittingBalance = $state(fromTinettiScore(b.sittingBalance));
	let risesFromChair = $state(fromTinettiScore(b.risesFromChair));
	let attemptingToRise = $state(fromTinettiScore(b.attemptingToRise));
	let immediateStandingBalance = $state(fromTinettiScore(b.immediateStandingBalance));
	let standingBalance = $state(fromTinettiScore(b.standingBalance));
	let nudgedBalance = $state(fromTinettiScore(b.nudgedBalance));
	let eyesClosed = $state(fromTinettiScore(b.eyesClosed));
	let turning360 = $state(fromTinettiScore(b.turning360));
	let sittingDown = $state(fromTinettiScore(b.sittingDown));

	$effect(() => { b.sittingBalance = toTinettiScore(sittingBalance); });
	$effect(() => { b.risesFromChair = toTinettiScore(risesFromChair); });
	$effect(() => { b.attemptingToRise = toTinettiScore(attemptingToRise); });
	$effect(() => { b.immediateStandingBalance = toTinettiScore(immediateStandingBalance); });
	$effect(() => { b.standingBalance = toTinettiScore(standingBalance); });
	$effect(() => { b.nudgedBalance = toTinettiScore(nudgedBalance); });
	$effect(() => { b.eyesClosed = toTinettiScore(eyesClosed); });
	$effect(() => { b.turning360 = toTinettiScore(turning360); });
	$effect(() => { b.sittingDown = toTinettiScore(sittingDown); });

	const items: { name: string; label: string; opts: typeof score01; binding: 'sittingBalance' | 'risesFromChair' | 'attemptingToRise' | 'immediateStandingBalance' | 'standingBalance' | 'nudgedBalance' | 'eyesClosed' | 'turning360' | 'sittingDown' }[] = [
		{ name: 'sittingBalance', label: '1. Sitting Balance (0 = leans/slides, 1 = steady/safe)', opts: score01, binding: 'sittingBalance' },
		{ name: 'risesFromChair', label: '2. Rises from Chair (0 = unable, 1 = uses arms, 2 = without arms)', opts: score02, binding: 'risesFromChair' },
		{ name: 'attemptingToRise', label: '3. Attempting to Rise (0 = unable, 1 = >1 attempt, 2 = first attempt)', opts: score02, binding: 'attemptingToRise' },
		{ name: 'immediateStandingBalance', label: '4. Immediate Standing Balance (0 = unsteady, 1 = steady with aid, 2 = without aid)', opts: score02, binding: 'immediateStandingBalance' },
		{ name: 'standingBalance', label: '5. Standing Balance (0 = unsteady, 1 = wide stance, 2 = narrow without support)', opts: score02, binding: 'standingBalance' },
		{ name: 'nudgedBalance', label: '6. Nudged (0 = begins to fall, 1 = staggers, 2 = steady)', opts: score02, binding: 'nudgedBalance' },
		{ name: 'eyesClosed', label: '7. Eyes Closed (0 = unsteady, 1 = steady)', opts: score01, binding: 'eyesClosed' },
		{ name: 'turning360', label: '8. Turning 360 degrees (0 = discontinuous, 1 = continuous or steady, 2 = continuous and steady)', opts: score02, binding: 'turning360' },
		{ name: 'sittingDown', label: '9. Sitting Down (0 = unsafe, 1 = uses arms, 2 = safe/smooth)', opts: score02, binding: 'sittingDown' }
	];

	function setValue(binding: typeof items[number]['binding'], v: string) {
		if (binding === 'sittingBalance') sittingBalance = v;
		else if (binding === 'risesFromChair') risesFromChair = v;
		else if (binding === 'attemptingToRise') attemptingToRise = v;
		else if (binding === 'immediateStandingBalance') immediateStandingBalance = v;
		else if (binding === 'standingBalance') standingBalance = v;
		else if (binding === 'nudgedBalance') nudgedBalance = v;
		else if (binding === 'eyesClosed') eyesClosed = v;
		else if (binding === 'turning360') turning360 = v;
		else if (binding === 'sittingDown') sittingDown = v;
	}
	function getValue(binding: typeof items[number]['binding']): string {
		if (binding === 'sittingBalance') return sittingBalance;
		if (binding === 'risesFromChair') return risesFromChair;
		if (binding === 'attemptingToRise') return attemptingToRise;
		if (binding === 'immediateStandingBalance') return immediateStandingBalance;
		if (binding === 'standingBalance') return standingBalance;
		if (binding === 'nudgedBalance') return nudgedBalance;
		if (binding === 'eyesClosed') return eyesClosed;
		if (binding === 'turning360') return turning360;
		return sittingDown;
	}
</script>

<Fieldset legend="Balance Assessment (Tinetti)">
	<p class="hint">Tinetti Balance Test - 9 items, maximum 16 points.</p>

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
