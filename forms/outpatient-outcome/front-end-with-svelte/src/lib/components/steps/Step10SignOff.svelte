<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const d = assessment.data.signOff;

	function setSignedOffNow() {
		assessment.data.signOff.signedOffAt = new Date().toISOString().slice(0, 16);
	}
</script>

<Fieldset title="Sign-off" description="Clinician completing this report">
	<TextInput
		label="Reporting Clinician Name"
		name="reportingClinicianName"
		bind:value={d.reportingClinicianName}
		placeholder="Full name"
		required
	/>

	<TextInput
		label="Role / Grade"
		name="reportingClinicianRole"
		bind:value={d.reportingClinicianRole}
		placeholder="e.g. Consultant, SpR, ANP"
		required
	/>

	<div class="mb-4">
		<label for="signedOffAt" class="mb-1 block text-sm font-medium text-base-content/80">
			Date and Time of Sign-off <span class="text-error">*</span>
		</label>
		<div class="flex gap-2">
			<input
				id="signedOffAt"
				name="signedOffAt"
				type="datetime-local"
				bind:value={d.signedOffAt}
				class="flex-1 rounded-lg border border-base-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
			/>
			<button
				type="button"
				onclick={setSignedOffNow}
				class="rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm font-medium text-base-content/80 hover:bg-base-200"
			>
				Now
			</button>
		</div>
	</div>
</Fieldset>
