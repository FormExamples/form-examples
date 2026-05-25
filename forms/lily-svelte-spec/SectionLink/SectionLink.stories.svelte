<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SectionLink from './SectionLink.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SectionLink',
    component: SectionLink,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'SectionLink'}}
>
  <span>SectionLink</span>
</Story>
