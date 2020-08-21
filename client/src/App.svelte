<script>
	import Explorer from "./Explorer.svelte";
	import ImageViewer from "./ImageViewer.svelte";
</script>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>

<div class="app">
	<Explorer />
	<ImageViewer />
</div>