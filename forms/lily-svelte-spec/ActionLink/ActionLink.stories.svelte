<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ActionLink from './ActionLink.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ActionLink',
    component: ActionLink,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Action Link','href':'#'}}
>
  <span>Link text</span>
</Story>
