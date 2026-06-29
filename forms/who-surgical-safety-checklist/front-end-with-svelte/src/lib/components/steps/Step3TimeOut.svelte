<script lang="ts">
	import { store } from '$lib/stores/checklist.svelte.js';
	import { createEmptyTeamMember } from '$lib/checklist/factory.js';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const c = store.data;

	function signOff() {
		if (!c.timeOutCompletedAt) c.timeOutCompletedAt = new Date().toISOString();
	}
	function clearSignOff() {
		c.timeOutCompletedAt = '';
	}
	function addMember() {
		c.teamMembers = [...c.teamMembers, createEmptyTeamMember()];
	}
	function removeMember(i: number) {
		c.teamMembers = c.teamMembers.filter((_, idx) => idx !== i);
	}
</script>

<Fieldset legend="Step 3 — Time Out (before incision)">
	<p class="hint">Before skin incision. Required: nurse, anaesthetist, surgeon.</p>

	<Field label="1. All team members have introduced themselves by name and role">
		<RadioGroup label="All team members have introduced themselves by name and role">
			<label
				><input type="radio" class="radio-input" name="toIntro" value="yes" bind:group={c.timeOutTeamIntroductionsConfirmed} /> Confirmed</label
			>
		</RadioGroup>
	</Field>

	<Field label="2. Patient name, procedure, and incision site confirmed">
		<RadioGroup label="Patient name, procedure, and incision site confirmed">
			<label
				><input type="radio" class="radio-input" name="toPatient" value="yes" bind:group={c.timeOutPatientProcedureIncisionConfirmed} /> Confirmed</label
			>
		</RadioGroup>
	</Field>

	<Field label="3. Antibiotic prophylaxis given within the last 60 minutes?">
		<RadioGroup label="Antibiotic prophylaxis given within the last 60 minutes?">
			<label
				><input type="radio" class="radio-input" name="toAbx" value="yes" bind:group={c.timeOutAntibioticProphylaxisWithin60Min} /> Yes</label
			>
			<label
				><input type="radio" class="radio-input" name="toAbx" value="not-applicable" bind:group={c.timeOutAntibioticProphylaxisWithin60Min} /> N/A</label
			>
		</RadioGroup>
	</Field>

	<Field label="4. Surgeon — critical or non-routine steps" inputId="toCriticalSteps">
		<TextAreaInput id="toCriticalSteps" label="Surgeon critical or non-routine steps" rows={2} bind:value={c.timeOutSurgeonCriticalSteps} />
	</Field>

	<Field label="5. Surgeon — anticipated case duration (minutes)" inputId="toDuration">
		<NumberInput id="toDuration" label="Anticipated case duration in minutes" min={0} bind:value={c.timeOutSurgeonCaseDurationMinutes} />
	</Field>

	<Field label="6. Surgeon — anticipated blood loss (ml)" inputId="toBloodLoss">
		<NumberInput id="toBloodLoss" label="Anticipated blood loss in ml" min={0} bind:value={c.timeOutSurgeonAnticipatedBloodLossMl} />
	</Field>

	<Field label="7. Anaesthetist — patient-specific concerns" inputId="toConcerns">
		<TextAreaInput id="toConcerns" label="Anaesthetist patient-specific concerns" rows={2} bind:value={c.timeOutAnaesthetistPatientConcerns} />
	</Field>

	<Field label="8. Nursing — sterility (including indicator results) confirmed">
		<RadioGroup label="Nursing sterility confirmed">
			<label
				><input type="radio" class="radio-input" name="toSterility" value="yes" bind:group={c.timeOutNursingSterilityConfirmed} /> Confirmed</label
			>
		</RadioGroup>
	</Field>

	<Field label="9. Nursing — equipment issues or concerns" inputId="toEquipment">
		<TextAreaInput id="toEquipment" label="Nursing equipment issues or concerns" rows={2} bind:value={c.timeOutNursingEquipmentConcerns} />
	</Field>

	<Field label="10. Is essential imaging displayed?">
		<RadioGroup label="Is essential imaging displayed?">
			<label
				><input type="radio" class="radio-input" name="toImaging" value="yes" bind:group={c.timeOutEssentialImagingDisplayed} /> Yes</label
			>
			<label
				><input type="radio" class="radio-input" name="toImaging" value="not-applicable" bind:group={c.timeOutEssentialImagingDisplayed} /> N/A</label
			>
		</RadioGroup>
	</Field>

	<h3 class="mt-6 mb-2 text-lg font-semibold text-base-content">Operating-team roster</h3>
	<p class="hint">Add one row per person introduced during the Time Out.</p>

	{#each c.teamMembers as _member, i (i)}
		<div class="mb-3 grid grid-cols-1 gap-3 rounded-lg border border-base-300 p-3 md:grid-cols-4 md:items-end">
			<Field label="Name" inputId={`tmName${i}`}>
				<TextInput id={`tmName${i}`} label="Name" bind:value={c.teamMembers[i].name} />
			</Field>
			<Field label="Role" inputId={`tmRole${i}`}>
				<Select id={`tmRole${i}`} label="Role" bind:value={c.teamMembers[i].role}>
					<option value="">-- Select --</option>
					<option value="surgeon">Surgeon</option>
					<option value="anaesthetist">Anaesthetist</option>
					<option value="circulating-nurse">Circulating nurse</option>
					<option value="scrub-nurse">Scrub nurse</option>
					<option value="other">Other</option>
				</Select>
			</Field>
			<Field label="Introduced?">
				<RadioGroup label="Introduced?">
					<label
						><input type="radio" class="radio-input" name={`tmIntro${i}`} value="yes" bind:group={c.teamMembers[i].introducedDuringTimeOut} /> Yes</label
					>
					<label
						><input type="radio" class="radio-input" name={`tmIntro${i}`} value="no" bind:group={c.teamMembers[i].introducedDuringTimeOut} /> No</label
					>
				</RadioGroup>
			</Field>
			<Button data-variant="danger" onclick={() => removeMember(i)}>Remove</Button>
		</div>
	{/each}
	<Button data-variant="secondary" onclick={addMember}>+ Add team member</Button>

	<h3 class="mt-6 mb-2 text-lg font-semibold text-base-content">Time Out coordinator sign-off</h3>

	<Field label="Coordinator name" inputId="timeOutCoordinatorName">
		<TextInput id="timeOutCoordinatorName" label="Coordinator name" bind:value={c.timeOutCoordinatorName} />
	</Field>

	<Field label="Coordinator role" inputId="timeOutCoordinatorRole">
		<Select id="timeOutCoordinatorRole" label="Coordinator role" bind:value={c.timeOutCoordinatorRole}>
			<option value="">-- Select --</option>
			<option value="circulating-nurse">Circulating nurse</option>
			<option value="anaesthetist">Anaesthetist</option>
			<option value="surgeon">Surgeon</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<div class="mt-3 flex items-center gap-3">
		<Button data-variant="primary" onclick={signOff}>Sign Time-Out now</Button>
		{#if c.timeOutCompletedAt}
			<span class="text-sm text-base-content/70">Signed at <code>{c.timeOutCompletedAt}</code></span>
			<Button data-variant="secondary" onclick={clearSignOff}>Clear</Button>
		{/if}
	</div>
</Fieldset>
