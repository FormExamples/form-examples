<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GrailLayout from './GrailLayout.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GrailLayout',
    component: GrailLayout,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Layout section content</p>
</Story>
