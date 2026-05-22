<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-7xl mx-auto p-6">
  <header class="mb-4 pb-3 border-b">
    <h1 class="text-2xl font-bold text-brand-600">
      LPA Finance Dashboard
    </h1>
    <p class="text-sm text-slate-600">
      United Kingdom Lasting Power of Attorney for Financial Decisions (LP1F)
      — registration-readiness, decision mode, validation flags.
    </p>
  </header>

  {@render children()}

  <footer class="mt-10 pt-4 border-t text-xs text-slate-500">
    <p>
      Office of the Public Guardian form LP1F. Mental Capacity Act 2005.
      LPA Regulations 2007 (SI 2007/1253). Reference data only — not legal advice.
    </p>
  </footer>
</div>
