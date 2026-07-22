<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ScaleItemField from './ScaleItemField.svelte';
	import { GENERAL_HEALTH_SCALE, HEALTH_CHANGE_SCALE } from '$lib/config/scales';

	const s = assessment.data.sf36;
</script>

<Fieldset legend="Step 2 of 9 — SF-36v2: general health (Q1-2)">
	<p class="hint">The first two SF-36v2 questions ask about your health in general.</p>

	<ScaleItemField
		number="Q1"
		legend="In general, would you say your health is:"
		name="sf36-generalHealth"
		options={GENERAL_HEALTH_SCALE}
		bind:value={s.generalHealth}
	/>

	<ScaleItemField
		number="Q2"
		legend="Compared to one year ago, how would you rate your health in general now?"
		name="sf36-healthChangeVsYearAgo"
		options={HEALTH_CHANGE_SCALE}
		bind:value={s.healthChangeVsYearAgo}
	/>
</Fieldset>
