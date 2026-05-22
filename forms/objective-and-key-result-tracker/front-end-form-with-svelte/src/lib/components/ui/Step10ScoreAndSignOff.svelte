<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  import { gradeObjective } from '$engine/composite-grader';
  import type { GradeResult } from '$engine/types';
  import RagBadge from './RagBadge.svelte';
  import FlagList from './FlagList.svelte';

  let result: GradeResult | null = $state(null);

  function compute() { result = gradeObjective(formState.buildAssessment()); }

  async function copyTriage() {
    if (!result) return;
    const lines = [
      `[OKR] ${formState.objective.obj_title}`,
      `RAG: ${result.computedCompositeRag.toUpperCase()}  Progress: ${formState.scores.progressPercent}%  Conf: ${formState.scores.confidenceDecile}/10`,
      `KRs (${formState.keyResults.length}):`,
      ...formState.keyResults.map((k) => `  ${k.position}. ${k.title} — ${k.currentValue}/${k.targetValue}`),
      `Flags: ${result.flags.map((f) => `${f.flagCode}(${f.priority})`).join(', ') || '(none)'}`,
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
  }

  async function downloadPdf() {
    if (!result) return;
    // @ts-expect-error — pdfmake has no published types
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    // @ts-expect-error — pdfmake has no published types
    const pdfFonts = await import('pdfmake/build/vfs_fonts');
    pdfMake.vfs = (pdfFonts as any).pdfMake.vfs;
    pdfMake.createPdf({
      content: [
        { text: 'OKR Tracker Report', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        { text: formState.objective.obj_title || '(no title)', fontSize: 14, bold: true },
        { text: `RAG: ${result.computedCompositeRag.toUpperCase()}`, fontSize: 16, bold: true, color: result.computedCompositeRag === 'red' ? '#c0392b' : result.computedCompositeRag === 'amber' ? '#c47a00' : '#2c8a3a' },
        { text: 'Key Results', fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
        { ul: formState.keyResults.map((k) => `${k.position}. ${k.title} — ${k.currentValue}/${k.targetValue}`) },
        { text: 'Flags', fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
        { ul: result.flags.map((f) => `[${f.priority}] ${f.flagCode}: ${f.description}`) },
      ],
    }).download(`okr-${(formState.objective.obj_title || 'objective').replaceAll(/\s+/g, '-')}.pdf`);
  }
</script>

<section class="border rounded p-4" data-step="10">
  <h2 class="text-xl font-semibold mb-3">10. Score &amp; sign-off</h2>
  <div class="grid grid-cols-2 gap-3">
    <label>Progress percent (0–100)<input class="w-full border p-1" type="number" min="0" max="100" bind:value={formState.scores.progressPercent}/></label>
    <label>Confidence decile (1–10)<input class="w-full border p-1" type="number" min="1" max="10" bind:value={formState.scores.confidenceDecile}/></label>
    <label>Stretch tier
      <select class="w-full border p-1" bind:value={formState.scores.stretchTier}>
        <option value={null}>—</option>
        <option value={1}>1 — committed</option>
        <option value={2}>2 — aspirational</option>
        <option value={3}>3 — moonshot</option>
      </select>
    </label>
    <label>Alignment grade (1–5)<input class="w-full border p-1" type="number" min="1" max="5" bind:value={formState.scores.alignmentGrade}/></label>
    <label>Impact tier (1–5)<input class="w-full border p-1" type="number" min="1" max="5" bind:value={formState.scores.impactTier}/></label>
    <label>SMART quality (0–5)<input class="w-full border p-1" type="number" min="0" max="5" bind:value={formState.scores.smartQuality}/></label>
    <label>Pace deviation % (-100..+100)<input class="w-full border p-1" type="number" min="-100" max="100" bind:value={formState.scores.paceDeviationPercent}/></label>
    <label>Signed by<input class="w-full border p-1" bind:value={formState.signature.signed_by}/></label>
  </div>
  <div class="mt-4 flex gap-2">
    <button type="button" class="bg-blue-700 text-white px-3 py-1 rounded" onclick={compute} data-test="btn-compute">Compute score</button>
    <button type="button" class="bg-gray-700 text-white px-3 py-1 rounded" onclick={downloadPdf} data-test="btn-pdf">Download PDF</button>
    <button type="button" class="bg-gray-700 text-white px-3 py-1 rounded" onclick={copyTriage} data-test="btn-copy">Copy triage line</button>
  </div>
  <div class="mt-4" data-test="result">
    {#if result}
      <RagBadge band={result.computedCompositeRag}/>
      <FlagList flags={result.flags}/>
    {/if}
  </div>
</section>
