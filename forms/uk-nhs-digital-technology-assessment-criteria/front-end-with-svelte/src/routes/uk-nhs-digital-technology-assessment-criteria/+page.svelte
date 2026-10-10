<script lang="ts">
	// Welcome page: one-sentence summary, links to every route choice, then a
	// plain-language explanation of the form and its specification.
	const base = '/uk-nhs-digital-technology-assessment-criteria';
</script>

<main class="mx-16 px-4 py-12">
	<h1 class="text-2xl font-bold text-base-content">UK NHS Digital Technology Assessment Criteria (DTAC)</h1>
	<p class="mt-2 text-base-content/80">
		Record whether a digital health product meets each of the 47 NHS England DTAC criteria and get
		an overall outcome with flagged issues.
	</p>

	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		<a
			href="{base}/assessments/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the single-page wizard: supplier, product, assessor, then the seven DTAC sections.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="{base}/assessments"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Assessments dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed products with their outcome, mandatory criteria met and flag count.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Commissioners, procurement leads and assurance teams use the DTAC to judge whether a
					digital health technology is safe and suitable for the NHS. This form captures the
					supplier, the product and the assessor, then records for each criterion in seven sections
					(company information, value proposition, clinical safety, data protection, technical
					security, interoperability, usability and accessibility) whether the evidence shows it is
					met, partially met, not met or not applicable. It produces a per-section result, an
					overall outcome (meets, meets with conditions, does not meet, or incomplete) and a list
					of flagged issues such as a missing Clinical Safety Officer or penetration test.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the grading engine and the
					flag rules, and the same engine grades every surface. Mandatory criteria drive the
					outcome; advisory criteria are counted and reported but never fail an assessment.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the NHS England Digital Technology Assessment Criteria, with clinical safety
					aligned to DCB0129/DCB0160. The criteria text is a summary for structured recording; always
					assess against the published DTAC and record its version. This tool records an assessment
					and does not confer compliance.
				</dd>
			</div>
		</dl>
	</section>
</main>
