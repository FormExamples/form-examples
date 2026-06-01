<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AlbaCommunityHealthIndexView from './AlbaCommunityHealthIndexView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AlbaCommunityHealthIndexView',
    component: AlbaCommunityHealthIndexView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Alba Community Health Index View'}}
/>
