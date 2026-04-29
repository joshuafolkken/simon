import type { Handle } from '@sveltejs/kit';
import { version } from '../package.json';

const APP_VERSION_PLACEHOLDER = '__APP_VERSION__';

export function inject_version(html: string): string {
	return html.replaceAll(APP_VERSION_PLACEHOLDER, version);
}

export const handle: Handle = async function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk({ html }) {
			return inject_version(html);
		}
	});
};
