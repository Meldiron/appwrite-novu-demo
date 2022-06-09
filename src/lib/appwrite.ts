import { Appwrite, type Models } from 'appwrite';
import { authStore } from './auth';

export const appwrite = new Appwrite();

appwrite
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);


export type Profile = {
    nickname: string;
    favouriteNumber: number;
} & Models.Document;

export type Follow = {
    createdAt: number;
    followBy: string;
    followTo: string;
} & Models.Document;

export async function fetchAuthStatus() {
    try {
        const user = await appwrite.account.get();
        const profile = await appwrite.database.getDocument<Profile>('profiles', user.$id);

        authStore.setUser(user);
        authStore.setProfile(profile);
    } catch (err) {
        console.warn(err);
    }
}