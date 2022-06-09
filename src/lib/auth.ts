import type { Models } from 'appwrite';
import { writable } from 'svelte/store';
import type { Profile } from './appwrite';

type Store = {
    user?: Models.User<any>,
    profile?: Profile
}

function createStore() {
    const typeStore = writable<Store>({});

    return {
        subscribe: typeStore.subscribe,
        setProfile: (profile: Profile | undefined) => typeStore.update((val) => {
            val.profile = profile;
            return val;
        }),
        setUser: (user: Models.User<any> | undefined) => typeStore.update((val) => {
            val.user = user;
            return val;
        })
    };
}

export const authStore = createStore();