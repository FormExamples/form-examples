<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">DEXA Bone Density Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">DEXA bone-density reports, graded and ready to share</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			The clinician's wizard records what a DEXA (dual-energy X-ray absorptiometry) scan found, and
			the shared grading engine computes a four-axis interpretation plus safety flags, including an
			automatic critical-result alert for severe osteoporosis with a fragility or vertebral fracture.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/dexa-bone-density-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard — examination details, clinical
				history, quantitative findings, fracture risk and comparison,
				impression, and sign-off — to produce a graded bone-densitometry
				report.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/dexa-bone-density-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded sample reports, filtering by result classification
				(normal / abnormal / critical / inconclusive) and by WHO
				classification (normal / osteopenia / osteoporosis / severe
				osteoporosis).
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-gray-900">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-gray-900">Purpose</dt>
				<dd class="mt-1 text-gray-600">
					Capturing the examination details, clinical history, T-scores and Z-scores at the lumbar
					spine, femoral neck, and total hip, the lowest T-score, bone mineral density in g/cm²,
					FRAX fracture probabilities, whether a vertebral fracture was identified, and comparison
					with previous scans, then grading them consistently on four independent axes — result
					classification, abnormality severity carrying the WHO densitometric classification,
					report completeness, and follow-up urgency — supports osteoporosis diagnosis and
					fracture-risk management, helping reporting clinicians apply the WHO densitometric
					classification correctly, track report completeness, and make sure severe osteoporosis or
					an identified vertebral fracture triggers an urgent specialist referral or treatment
					review rather than being missed.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data
					model, the four-axis grading engine, and the flag rules, and that
					same engine grades both the report wizard and the reports
					dashboard, so the two surfaces never disagree.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned with the WHO densitometric classification of osteoporosis
					(normal / osteopenia / osteoporosis / severe osteoporosis by
					T-score), the ISCD 2023 Official Adult Positions on T-score and
					Z-score use, and the UK National Osteoporosis Guideline Group
					(NOGG) clinical guideline for fracture-risk–based management.
				</dd>
			</div>
		</dl>
	</section>
</main>
