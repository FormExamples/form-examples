<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { anyNotWorking } from '#lib/engine/utils.js';

	const d = resultStore.data;

	/** The eight ACAS adjustment categories, bound to the effectiveness fields. */
	const categories = [
		{ id: 'effectivenessWorkingEnvironment', label: 'Working environment' },
		{ id: 'effectivenessEquipmentTechnology', label: 'Equipment or assistive technology' },
		{ id: 'effectivenessWorkingArrangements', label: 'Working arrangements' },
		{ id: 'effectivenessCommunication', label: 'Communication' },
		{ id: 'effectivenessSupportMentoring', label: 'Support or mentoring' },
		{ id: 'effectivenessRecruitmentProcess', label: 'Recruitment / assessment process' },
		{ id: 'effectivenessPolicyDress', label: 'Policy (dress code / uniform, absence)' },
		{ id: 'effectivenessOther', label: 'Other' }
	] as const;

	const showNotWorking = $derived(anyNotWorking(d));
</script>

<Fieldset legend="3. Effectiveness">
	<p class="hint">
		For each ACAS adjustment category in place, rate how well it is working. Choose
		<em>Not in place</em> where no adjustment of that type was agreed.
	</p>

	{#each categories as cat (cat.id)}
		<Field label={cat.label} inputId={cat.id}>
			<Select id={cat.id} label={cat.label} bind:value={d[cat.id]}>
				<option value="">Not rated</option>
				<option value="working-well">Working well</option>
				<option value="partial">Partially working</option>
				<option value="not-working">Not working</option>
				<option value="not-in-place">Not in place</option>
			</Select>
		</Field>
	{/each}

	{#if showNotWorking}
		<Alert type="warning" heading="An adjustment is not working">
			<p>
				At least one agreed adjustment is no longer working. This raises the
				adjustments-not-working alert and drives the next-step urgency. Act promptly — update the
				adjustment or consider an occupational-health re-referral.
			</p>
		</Alert>
	{/if}
</Fieldset>
