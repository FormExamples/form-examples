<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { Sf36Response } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ScaleItemField from './ScaleItemField.svelte';
	import { ACTIVITY_LIMITATION_SCALE } from '$lib/config/scales';

	const s = assessment.data.sf36;

	const items: Array<{ field: keyof Sf36Response; letter: string; text: string }> = [
		{
			field: 'vigorousActivities',
			letter: 'a',
			text: 'Vigorous activities, such as running, lifting heavy objects, participating in strenuous sports'
		},
		{
			field: 'moderateActivities',
			letter: 'b',
			text: 'Moderate activities, such as moving a table, pushing a vacuum cleaner, bowling, or playing golf'
		},
		{ field: 'liftingCarryingGroceries', letter: 'c', text: 'Lifting or carrying groceries' },
		{ field: 'climbingSeveralFlights', letter: 'd', text: 'Climbing several flights of stairs' },
		{ field: 'climbingOneFlight', letter: 'e', text: 'Climbing one flight of stairs' },
		{ field: 'bendingKneelingStooping', letter: 'f', text: 'Bending, kneeling, or stooping' },
		{ field: 'walkingMoreThanMile', letter: 'g', text: 'Walking more than a mile' },
		{ field: 'walkingSeveralHundredYards', letter: 'h', text: 'Walking several hundred yards' },
		{ field: 'walkingOneHundredYards', letter: 'i', text: 'Walking one hundred yards' },
		{ field: 'bathingDressing', letter: 'j', text: 'Bathing or dressing yourself' }
	];
</script>

<Fieldset legend="Step 3 of 9 — SF-36v2: activities (Q3a-j)">
	<p class="hint">
		Q3. The following items are about activities you might do during a typical day. Does your
		health now limit you in these activities? If so, how much?
	</p>

	{#each items as item (item.field)}
		<ScaleItemField
			number={`Q3${item.letter}`}
			legend={item.text}
			name={`sf36-${item.field}`}
			options={ACTIVITY_LIMITATION_SCALE}
			bind:value={s[item.field]}
		/>
	{/each}
</Fieldset>
