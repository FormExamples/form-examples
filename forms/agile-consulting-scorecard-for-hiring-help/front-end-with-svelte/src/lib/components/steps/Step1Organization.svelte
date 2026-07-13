<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { assessment } from '$lib/stores/assessment.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="1. Organization &amp; respondent">
	<p class="hint">Who is completing this scorecard and for which organization.</p>

	<Field label="Organization name" inputId="organizationName" required>
		<TextInput
			id="organizationName"
			label="Organization name"
			bind:value={d.organization.organizationName}
			required
		/>
	</Field>

	<Field label="Sector" inputId="sector">
		<Select id="sector" label="Sector" bind:value={d.organization.sector}>
			<option value="">Select…</option>
			<option value="healthcare">Healthcare</option>
			<option value="pharmaceuticals">Pharmaceuticals</option>
			<option value="medtech">MedTech</option>
			<option value="public-sector">Public sector</option>
			<option value="finance">Finance</option>
			<option value="insurance">Insurance</option>
			<option value="retail">Retail</option>
			<option value="manufacturing">Manufacturing</option>
			<option value="logistics">Logistics</option>
			<option value="energy">Energy</option>
			<option value="utilities">Utilities</option>
			<option value="media">Media</option>
			<option value="telecommunications">Telecommunications</option>
			<option value="technology">Technology</option>
			<option value="education">Education</option>
			<option value="charity">Charity</option>
			<option value="agriculture">Agriculture</option>
			<option value="professional-services">Professional services</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Size band" inputId="sizeBand">
		<Select id="sizeBand" label="Size band" bind:value={d.organization.sizeBand}>
			<option value="">Select…</option>
			<option value="micro">Micro (&lt; 10)</option>
			<option value="small">Small (10–49)</option>
			<option value="medium">Medium (50–249)</option>
			<option value="large">Large (250–999)</option>
			<option value="enterprise">Enterprise (1000+)</option>
		</Select>
	</Field>

	<Field label="Respondent name" inputId="respondentName" required>
		<TextInput
			id="respondentName"
			label="Respondent name"
			bind:value={d.respondent.respondentName}
			required
		/>
	</Field>

	<Field label="Respondent email" inputId="respondentEmail">
		<TextInput
			id="respondentEmail"
			label="Respondent email"
			type="email"
			bind:value={d.respondent.respondentEmail}
		/>
	</Field>

	<Field label="Role" inputId="role">
		<Select id="role" label="Role" bind:value={d.respondent.role}>
			<option value="">Select…</option>
			<option value="cxo">CXO</option>
			<option value="vp">VP</option>
			<option value="director">Director</option>
			<option value="head-of-product">Head of Product</option>
			<option value="head-of-engineering">Head of Engineering</option>
			<option value="head-of-delivery">Head of Delivery</option>
			<option value="transformation-lead">Transformation Lead</option>
			<option value="programme-manager">Programme Manager</option>
			<option value="product-manager">Product Manager</option>
			<option value="engineering-manager">Engineering Manager</option>
			<option value="agile-coach">Agile Coach</option>
			<option value="scrum-master">Scrum Master</option>
			<option value="consultant">Consultant</option>
			<option value="employee">Employee</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Assessment date" inputId="assessmentDate" required>
		<DateInput id="assessmentDate" label="Assessment date" bind:value={d.assessment.assessmentDate} required />
	</Field>
</Fieldset>
