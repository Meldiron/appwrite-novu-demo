<script lang="ts">
	import { goto } from '$app/navigation';
	import Loader from '$lib/Loader.svelte';

	import { appwrite, type Profile } from '$lib/appwrite';
	import { authStore } from '$lib/auth';
	import { onMount } from 'svelte';

	$: isAuthorized = $authStore.profile && $authStore.user;

	onMount(() => {
		if (isAuthorized) {
			goto('/app');
		}
	});

	let registerMail = '';
	let registerPassword = '';
	let registerNickname = '';
	let registerNumber = '';
	let registerProcessing = false;

	let loginMail = '';
	let loginPassword = '';
	let loginProcessing = false;

	async function onRegister() {
		if (registerProcessing) {
			return;
		}

		try {
			registerProcessing = true;

			const user = await appwrite.account.create('unique()', registerMail, registerPassword);
			const _session = await appwrite.account.createSession(registerMail, registerPassword);

			const profile = await appwrite.database.createDocument<Profile>('profiles', user.$id, {
				nickname: registerNickname,
				favouriteNumber: +registerNumber
			});

			authStore.setUser(user);
			authStore.setProfile(profile);

			goto('/app');
		} catch (err: any) {
			console.error(err);
			alert(err.message ?? err);
		} finally {
			registerProcessing = false;
		}
	}

	async function onLogin() {
		if (loginProcessing) {
			return;
		}

		try {
			loginProcessing = true;

			const _session = await appwrite.account.createSession(loginMail, loginPassword);

			const user = await appwrite.account.get();
			const profile = await appwrite.database.getDocument<Profile>('profiles', user.$id);

			authStore.setUser(user);
			authStore.setProfile(profile);

			goto('/app');
		} catch (err: any) {
			console.error(err);
			alert(err.message ?? err);
		} finally {
			loginProcessing = false;
		}
	}
</script>

<p class="mb-8 text-lg text-slate-800">
	<a href="https://appwrite.io/" class="underline">Appwrite</a> is backend as a service that can
	replace your whole backend. This not only makes development easier and secure, but also more fun!
	Talking about fun, <a href="https://novu.co/" class="underline">Novu</a> is notification server made
	right! Within a few minutes of configuration, your app wil use the most powerful open-source notification
	manager.
</p>

<p class="mb-8 text-lg text-slate-400">
	This is a demo application showcasing that Appwrite and Novu plays well together. You can check
	out source code of this application on <a
		href="https://github.com/Meldiron/appwrite-novu-demo"
		class="underline">GitHub</a
	>.
</p>

<h2 class="text-2xl font-bold text-slate-800 mb-8 mt-8">Let's Create Account!</h2>

<p class="mb-8 text-lg text-slate-800">
	Since we are showcasing notifications, and notifications are usually personalized, let's make an
	account. Feel free to use fake information, but keep in mind, you won't be able to see email
	notifications if you dont provide valid email.
</p>

<p class="mb-8 text-lg text-slate-400">
	Your email is stored only for authentication purposes and is never shared with any anyone. Not
	even in your in-app profile!
</p>

<div class="grid grid-cols-6 md:grid-cols-12 gap-12">
	<form on:submit|preventDefault={onRegister} class="col-span-6 flex flex-col space-y-3">
		<h2 class="text-lg text-pink-500 uppercase">New user? Register!</h2>

		<input
			bind:value={registerMail}
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="email"
			required={true}
			placeholder="Your e-mail address"
		/>
		<input
			bind:value={registerPassword}
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="password"
			required={true}
			placeholder="Your password"
		/>
		<input
			bind:value={registerNickname}
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="text"
			required={true}
			placeholder="Your nickname"
		/>
		<input
			bind:value={registerNumber}
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="number"
			required={true}
			placeholder="Your favourite number"
		/>
		<button
			type="submit"
			class="flex items-center justify-center space-x-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-10 py-3"
		>
			{#if registerProcessing}
				<Loader />
			{/if}

			<span>Register</span>
		</button>
	</form>

	<form on:submit|preventDefault={onLogin} class="col-span-6 flex flex-col space-y-3">
		<h2 class="text-lg text-pink-500 uppercase">Existing user? Login!</h2>

		<input
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="email"
			required={true}
			bind:value={loginMail}
			placeholder="Your e-mail address"
		/>
		<input
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="password"
			required={true}
			bind:value={loginPassword}
			placeholder="Your password"
		/>
		<button
			type="submit"
			class="flex items-center justify-center space-x-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-10 py-3"
		>
			{#if loginProcessing}
				<Loader />
			{/if}
			<span>Login</span>
		</button>
	</form>
</div>
