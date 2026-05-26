<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const r = assessment.data.patientRights;

	const acknowledgementOptions = [
		{ value: 'yes', label: 'I acknowledge' },
		{ value: 'no', label: 'I do not acknowledge' }
	];
</script>

<Fieldset legend="Patient Rights">
	<p class="hint">Please review and acknowledge the following rights.</p>

	<Alert type="info" heading="Right to Revoke">
		<p>
			You have the right to revoke this authorization at any time by providing written notice to
			your healthcare provider. Revocation will not apply to information already released in
			reliance on this authorization.
		</p>
	</Alert>

	<Field label="I acknowledge my right to revoke this authorization" required>
		<RadioGroup label="I acknowledge my right to revoke this authorization">
			{#each acknowledgementOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="acknowledgedRightToRevoke"
						value={opt.value}
						bind:group={r.acknowledgedRightToRevoke}
						required
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Alert type="info" heading="No Charge for Access">
		<p>
			Under the UK Data Protection Act 2018 and UK GDPR, you are entitled to receive a copy of your
			medical records free of charge. A reasonable fee may only be charged for additional copies or
			manifestly unfounded requests.
		</p>
	</Alert>

	<Field label="I acknowledge there is generally no charge for access to my records">
		<RadioGroup label="I acknowledge there is generally no charge for access to my records">
			{#each acknowledgementOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="acknowledgedNoChargeForAccess"
						value={opt.value}
						bind:group={r.acknowledgedNoChargeForAccess}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Alert type="info" heading="Data Protection">
		<p>
			Your medical records are protected under the UK Data Protection Act 2018 and UK GDPR. The
			recipient of your records is obligated to handle your data in accordance with these
			regulations and must not use the information for purposes beyond those stated in this
			authorization.
		</p>
	</Alert>

	<Field label="I acknowledge my data protection rights" required>
		<RadioGroup label="I acknowledge my data protection rights">
			{#each acknowledgementOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="acknowledgedDataProtection"
						value={opt.value}
						bind:group={r.acknowledgedDataProtection}
						required
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
