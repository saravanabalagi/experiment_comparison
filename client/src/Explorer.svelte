<script>
	import {filePath, currentPath, currentPathIndex, allowedExtensions, operationMode, operationModes} from "./stores";
	import * as path from 'path';
	export let level;

	let cPath, currentPathTokens;
	$: {
		currentPathTokens = $currentPath.split('/');
		cPath = getExplorerPath(currentPathTokens, level); // Current Path of this Component
	}


	function getExplorerPath(pathTokens, level) {
		if(level === -1) return '.';
		else return path.join(...pathTokens.slice(0,level+1));
	}

	let files, selectedIndex, selectedFileName;
	$: if (files != null && selectedIndex != null && $operationMode === operationModes.index) {
		selectedFileName = files[selectedIndex].name;
		if (files[selectedIndex].directory) {
			if (currentPathTokens[level + 1] !== selectedFileName)
				setSelectedFolder(selectedIndex);
		} else {
			if ($filePath != null && selectedFileName !== path.basename($filePath))
				setSelectedFile(selectedIndex);
		}
	}

	$: if(files != null && selectedFileName != null && $operationMode === operationModes.name) {
		const reqFiles = files.filter(f => f.name === selectedFileName);
		if (reqFiles.length > 0) {
			const reqFile = reqFiles[0];
			if(reqFile.directory) setSelectedFolder(reqFile.index);
			else setSelectedFile(reqFile.index);
		} else {
			currentPath.set(cPath);
			currentPathIndex.update(e => [...e.slice(0, level+1)]);
		}
	}

	function setSelectedFolder(i) {
		const file = files[i];
		selectedIndex = i;
		if($operationMode === operationModes.name) selectedFileName = file.name;
		const pathTokens = [...currentPathTokens];
		pathTokens[level+1] = file.name;
		currentPath.set(pathTokens.join('/'));
		currentPathIndex.update(e => [...e.slice(0, level+1), file.index, ...e.slice(level+2)]);
	}

	function setSelectedFile(i) {
		const file = files[i];
		selectedIndex = i;
		if($operationMode === operationModes.name) selectedFileName = file.name;
		currentPath.set(cPath);
		currentPathIndex.update(e => [...e.slice(0, level+1), file.index]);
		filePath.set(path.join(cPath, file.name));
	}

	$: promise = fetchFiles(cPath);
	async function fetchFiles(rPath) {
		const pathStr = (rPath == null || rPath === '.') ? "" : `?path=${rPath}`
		const url = `/files${pathStr}`;
		const response = await fetch(url);
		if(response.ok) {
			const responseJson = await response.json();
			files = responseJson.map((e,i) => ({...e, index: i}));
			return files;
		} else throw new Error(await response.text());
	}

</script>

<div class="explorer">
<!--	cPath: {cPath} <br/>-->
<!--	Selected: {selectedFileName} {level}-->
	{#await promise}
		<p>Loading...</p>
	{:then response}
		{#each files as file, i}
			{#if file.directory}
				<div class="explorerContent directory" class:active="{file.name === selectedFileName}"
					 on:click={() => setSelectedFolder(i)}> {file.name} </div>
			{:else if allowedExtensions.some(e => file.name.endsWith(e))}
				<div class="explorerContent file" class:active="{file.name === selectedFileName}"
					 on:click={() => setSelectedFile(i)}> {file.name} </div>
			{/if}
		{/each}
	{:catch error}
		{error}
	{/await}
</div>

<style>
	.explorerContent {
		padding: 0 10px;
	}
	.active {
		background-color: #ccc;
	}
</style>