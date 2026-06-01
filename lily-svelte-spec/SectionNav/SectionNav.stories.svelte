<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SectionNav from './SectionNav.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SectionNav',
    component: SectionNav,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'SectionNav'}}
>
  <span>SectionNav</span>
</Story>
