<script>
	import Experiments from "./Experiments.svelte";
	let path = '.';

	const isExperimentPresent = (files) => files.filter(e => e.directory && e.name === 'experiments').length === 1;
	async function fetchFiles(path) {
		const pathStr = (path == null || path === '.') ? "" : `?path=${path}`
		const url = `/files${pathStr}`;
		const response = await fetch(url);
		return await response.json();
	}

	function setChildPath(filename) {
		path = `${path}/${filename}`;
	}

	function setParentPath() {
		const pathTokens = path.split('/');
		path = pathTokens.slice(0, pathTokens.length - 1).join('/');
	}
</script>

<div class="explorer">
	{#await fetchFiles(path)}
		<p>Loading...</p>
	{:then files}
		<div>
			{#if isExperimentPresent(files)}
				<Experiments path={`${path}/experiments`} folder={'.'} fetchFiles={fetchFiles} level={1} />
			{:else}
				Explorer Mode
				<div class="files">
					{#if path!=='.'}
						<div on:click={setParentPath}>Parent Folder</div>
					{/if}
					{#each files as file}
						<div on:click={() => setChildPath(file.name)}>{file.directory?"Folder":"File"} {file.name}</div>
					{/each}
				</div>
			{/if}
		</div>
	{:catch error}
		Error: {error}
	{/await}
</div>