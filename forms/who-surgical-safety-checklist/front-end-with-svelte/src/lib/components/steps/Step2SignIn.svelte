<script lang="ts">
	import { store } from '#lib/stores/checklist.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const c = store.data;

	function signOff() {
		if (!c.signInCompletedAt) c.signInCompletedAt = new Date().toISOString();
	}
	function clearSignOff() {
		c.signInCompletedAt = '';
	}
</script>

<Fieldset legend="Step 2 — Sign In (before induction)">
	<p class="hint">Before induction of anaesthesia. Required: at least nurse and anaesthetist.</p>

	<Field label="1. Has the patient confirmed identity, site, procedure, and consent?">
		<RadioGroup label="Has the patient confirmed identity, site, procedure, and consent?">
			<label
				><input
					type="radio"
					class="radio-input"
					name="signInIdentity"
					value="yes"
					bind:group={c.signInIdentitySiteProcedureConsent}
				/> Yes</label
			>
		</RadioGroup>
	</Field>

	<Field label="2. Is the surgical site marked?">
		<RadioGroup label="Is the surgical site marked?">
			<label
				><input type="radio" class="radio-input" name="signInSiteMarked" value="yes" bind:group={c.signInSiteMarked} /> Yes</label
			>
			<label
				><input type="radio" class="radio-input" name="signInSiteMarked" value="not-applicable" bind:group={c.signInSiteMarked} /> N/A</label
			>
		</RadioGroup>
	</Field>

	<Field label="3. Anaesthesia machine and medication check complete?">
		<RadioGroup label="Anaesthesia machine and medication check complete?">
			<label
				><input type="radio" class="radio-input" name="signInAnaesthesia" value="yes" bind:group={c.signInAnaesthesiaCheckComplete} /> Yes</label
			>
		</RadioGroup>
	</Field>

	<Field label="4. Is the pulse oximeter on the patient and functioning?">
		<RadioGroup label="Is the pulse oximeter on the patient and functioning?">
			<label
				><input type="radio" class="radio-input" name="signInPulseOx" value="yes" bind:group={c.signInPulseOximeterOnPatient} /> Yes</label
			>
		</RadioGroup>
	</Field>

	<Field label="5. Does the patient have a known allergy?">
		<RadioGroup label="Does the patient have a known allergy?">
			<label
				><input type="radio" class="radio-input" name="signInAllergy" value="no" bind:group={c.signInKnownAllergy} /> No</label
			>
			<label
				><input type="radio" class="radio-input" name="signInAllergy" value="yes" bind:group={c.signInKnownAllergy} /> Yes</label
			>
		</RadioGroup>
	</Field>

	{#if c.signInKnownAllergy === 'yes'}
		<Field label="Allergy detail" inputId="signInKnownAllergyDetail">
			<TextInput
				id="signInKnownAllergyDetail"
				label="Allergy detail"
				placeholder="Allergen — reaction"
				bind:value={c.signInKnownAllergyDetail}
			/>
		</Field>
	{/if}

	<Field label="6. Difficult airway or aspiration risk?">
		<RadioGroup label="Difficult airway or aspiration risk?">
			<label
				><input type="radio" class="radio-input" name="signInAirway" value="no" bind:group={c.signInDifficultAirwayAspirationRisk} /> No</label
			>
			<label
				><input type="radio" class="radio-input" name="signInAirway" value="yes-equipment-available" bind:group={c.signInDifficultAirwayAspirationRisk} /> Yes — equipment and assistance available</label
			>
		</RadioGroup>
	</Field>

	<Field label="7. Risk of > 500 ml blood loss (7 ml/kg in children)?">
		<RadioGroup label="Risk of more than 500 ml blood loss?">
			<label
				><input type="radio" class="radio-input" name="signInBloodLoss" value="no" bind:group={c.signInBloodLossRisk} /> No</label
			>
			<label
				><input type="radio" class="radio-input" name="signInBloodLoss" value="yes-two-ivs-and-fluids-planned" bind:group={c.signInBloodLossRisk} /> Yes — two IVs and fluids planned</label
			>
		</RadioGroup>
	</Field>

	<h3 class="mt-6 mb-2 text-lg font-semibold text-base-content">Sign In coordinator sign-off</h3>

	<Field label="Coordinator name" inputId="signInCoordinatorName">
		<TextInput id="signInCoordinatorName" label="Coordinator name" bind:value={c.signInCoordinatorName} />
	</Field>

	<Field label="Coordinator role" inputId="signInCoordinatorRole">
		<Select id="signInCoordinatorRole" label="Coordinator role" bind:value={c.signInCoordinatorRole}>
			<option value="">-- Select --</option>
			<option value="circulating-nurse">Circulating nurse</option>
			<option value="anaesthetist">Anaesthetist</option>
			<option value="surgeon">Surgeon</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<div class="mt-3 flex items-center gap-3">
		<Button data-variant="primary" onclick={signOff}>Sign Sign-In now</Button>
		{#if c.signInCompletedAt}
			<span class="text-sm text-base-content/70">Signed at <code>{c.signInCompletedAt}</code></span>
			<Button data-variant="secondary" onclick={clearSignOff}>Clear</Button>
		{/if}
	</div>
</Fieldset>
