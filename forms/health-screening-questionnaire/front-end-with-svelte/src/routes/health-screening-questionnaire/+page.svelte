<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the screening wizard and the review
	// dashboard. The collection routes (`/health-screening-questionnaires` and
	// `/health-screening-questionnaires/new`) hold the actual functionality.
	const plural = 'health-screening-questionnaires';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/health-screening-questionnaire/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new screening</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step health screening questionnaire. One continuous single-page wizard
				across fourteen steps that computes a PAR-Q+ clearance status and an AUDIT-C alcohol band
				as you complete it, and saves the draft as you work.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/health-screening-questionnaire/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded screens with their PAR-Q+ clearance, AUDIT-C band, composite risk band, and
				referral recommendation, and filter by any of them.
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
					A generic, purpose-flexible baseline health and lifestyle screen used by employers, gyms
					and fitness professionals, and primary-care / preventive-health services. It establishes
					medical history, uncovers hidden risk factors, and flags whether further medical review is
					needed before starting an activity or role, or as a routine wellness check. Unlike this
					monorepo's condition-specific assessments, it screens broadly rather than diagnosing a
					single condition.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Scoring</dt>
				<dd class="mt-1 text-base-content/70">
					PAR-Q+ (Physical Activity Readiness Questionnaire for Everyone) is the primary instrument
					— a 7-item general health screen. AUDIT-C is the secondary instrument — the same 3-item
					alcohol screen used elsewhere in this monorepo. A composite risk band uses a max-grade
					algorithm, so the worst finding sets the band. Safety flags are computed independently and
					are never suppressed by an assessor override.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Assessor, not clinician</dt>
				<dd class="mt-1 text-base-content/70">
					The person conducting the screen is often not a clinician — a gym instructor, a personal
					trainer, or an HR officer, alongside GPs, practice nurses, and occupational-health nurses.
					See AGENTS.md for the naming rationale.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the scoring engine, and the
					safety-flag rules. The same pure engine grades both the form and the dashboard, and the
					HTML front-end runs an identical implementation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Status</dt>
				<dd class="mt-1 text-base-content/70">
					Clinical decision support. It does not make a diagnosis and does not replace the clinical
					judgement of a qualified professional, who must sign the screening before the report is
					final.
				</dd>
			</div>
		</dl>
	</section>
</main>
