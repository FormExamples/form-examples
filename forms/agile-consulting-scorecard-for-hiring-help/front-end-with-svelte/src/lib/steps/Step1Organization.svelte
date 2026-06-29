<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
</script>

<section>
	<h2 class="text-lg font-semibold text-base-content">Step 1 — Organization &amp; respondent</h2>

	<label class="block mt-3 text-sm">
		Organization name
		<input
			id="organizationName"
			type="text"
			class="w-full mt-1 p-1.5 rounded border border-base-300"
			bind:value={assessment.data.organization.organizationName}
		/>
	</label>

	<label class="block mt-3 text-sm">
		Sector
		<select
			class="w-full mt-1 p-1.5 rounded border border-base-300"
			bind:value={assessment.data.organization.sector}
		>
			<option value="">—</option>
			<option>healthcare</option>
			<option>pharmaceuticals</option>
			<option>medtech</option>
			<option>public-sector</option>
			<option>finance</option>
			<option>insurance</option>
			<option>retail</option>
			<option>manufacturing</option>
			<option>logistics</option>
			<option>energy</option>
			<option>utilities</option>
			<option>media</option>
			<option>telecommunications</option>
			<option>technology</option>
			<option>education</option>
			<option>charity</option>
			<option>agriculture</option>
			<option>professional-services</option>
			<option>other</option>
		</select>
	</label>

	<label class="block mt-3 text-sm">
		Size band
		<select
			class="w-full mt-1 p-1.5 rounded border border-base-300"
			bind:value={assessment.data.organization.sizeBand}
		>
			<option value="">—</option>
			<option value="micro">Micro (&lt; 10)</option>
			<option value="small">Small (10–49)</option>
			<option value="medium">Medium (50–249)</option>
			<option value="large">Large (250–999)</option>
			<option value="enterprise">Enterprise (1000+)</option>
		</select>
	</label>

	<label class="block mt-3 text-sm">
		Respondent name
		<input
			id="respondentName"
			type="text"
			class="w-full mt-1 p-1.5 rounded border border-base-300"
			bind:value={assessment.data.respondent.respondentName}
		/>
	</label>

	<label class="block mt-3 text-sm">
		Respondent email
		<input
			type="email"
			class="w-full mt-1 p-1.5 rounded border border-base-300"
			bind:value={assessment.data.respondent.respondentEmail}
		/>
	</label>

	<label class="block mt-3 text-sm">
		Role
		<select
			class="w-full mt-1 p-1.5 rounded border border-base-300"
			bind:value={assessment.data.respondent.role}
		>
			<option value="">—</option>
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
		</select>
	</label>

	<label class="block mt-3 text-sm">
		Assessment date
		<input
			id="assessmentDate"
			type="date"
			class="w-full mt-1 p-1.5 rounded border border-base-300"
			bind:value={assessment.data.assessment.assessmentDate}
		/>
	</label>
</section>
