<script lang="ts">
	import { application } from '#lib/stores/application.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const data = application.data;

	const fistula = $derived(
		data.qualifyingConditions.find((c) => c.code === 'permanent-fistula' && c.selected)
	);
	const disability = $derived(
		data.qualifyingConditions.find(
			(c) => c.code === 'continuing-physical-disability' && c.selected
		)
	);

	const fistulaSiteOptions = [
		{ value: 'caecostomy', label: 'Caecostomy' },
		{ value: 'colostomy', label: 'Colostomy' },
		{ value: 'laryngostomy', label: 'Laryngostomy' },
		{ value: 'ileostomy', label: 'Ileostomy' },
		{ value: 'urostomy', label: 'Urostomy' },
		{ value: 'gastrostomy', label: 'Gastrostomy' },
		{ value: 'other', label: 'Other' }
	];

	const applianceTypeOptions = [
		{ value: 'one-piece-bag', label: 'One-piece bag' },
		{ value: 'two-piece-bag', label: 'Two-piece bag' },
		{ value: 'continuous-dressing', label: 'Continuous dressing' },
		{ value: 'irrigation-kit', label: 'Irrigation kit' },
		{ value: 'other', label: 'Other' }
	];

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Disability / appliance attestation"
	description="Capture the appliance / dressing detail for a permanent fistula, and the home-care attestation for a continuing physical disability."
>
	{#if !fistula && !disability}
		<p class="text-sm text-base-content/60">
			This step applies only when a permanent fistula or a continuing physical disability is
			selected in Step 6.
		</p>
	{/if}

	{#if fistula}
		<div class="mb-6 rounded-lg border border-base-300 p-4">
			<h3 class="mb-3 text-base font-semibold text-base-content">
				Permanent fistula — appliance attestation
			</h3>

			<Select
				label="Anatomical site of the fistula"
				name="fistulaSite"
				options={fistulaSiteOptions}
				bind:value={fistula.fistulaSite}
				required
			/>

			<Select
				label="Appliance type"
				name="applianceType"
				options={applianceTypeOptions}
				bind:value={fistula.applianceType}
				required
			/>
		</div>
	{/if}

	{#if disability}
		<div class="mb-6 rounded-lg border border-base-300 p-4">
			<h3 class="mb-3 text-base font-semibold text-base-content">
				Continuing physical disability — home-care attestation
			</h3>

			<RadioGroup
				label="The patient is unable to leave home without the help of another person"
				name="cannotLeaveHomeUnaided"
				options={yesNoOptions}
				bind:value={disability.cannotLeaveHomeUnaided}
				required
			/>

			<RadioGroup
				label="The disability is expected to be permanent (not temporary, e.g. broken leg)"
				name="disabilityExpectedToBePermanent"
				options={yesNoOptions}
				bind:value={disability.disabilityExpectedToBePermanent}
				required
			/>

			<TextAreaInput
				label="Description of the help / carer the patient depends on"
				name="disabilityCarerDetail"
				bind:value={disability.disabilityCarerDetail}
				rows={3}
			/>
		</div>
	{/if}
</Fieldset>
