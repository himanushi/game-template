import { baseStore } from './baseStore';

export const prompt = baseStore<string>({ key: 'prompt', initialValue: '' });
