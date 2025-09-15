import qs from 'querystring';
import {
	FetchOptions,
	MutationDataOptions,
	MutationFormDataOptions,
} from '@/types/client.types';
import { client } from './axiosClient';

export async function fetchData<T>({
	url,
	inputParams,
}: FetchOptions): Promise<T> {
	let params = '';

	if (inputParams) {
		params = qs.stringify(inputParams);
	}

	return new Promise(async (resolve, reject) => {
		try {
			let fetchUrl = url;

			if (params) {
				fetchUrl += '?' + params;
			}

			const response = await client.get(fetchUrl);
			const json = await response.data;

			resolve(json);
		} catch (error) {
			reject(error);
		}
	});
}

export async function mutationData<T>({
	url,
	method,
	body,
	baseURL,
	inputParams,
	config,
}: MutationDataOptions): Promise<T> {
	let params = '';

	if (inputParams) {
		params = qs.stringify(inputParams);
	}

	return new Promise(async (resolve, reject) => {
		try {
			let mutationUrl = url;

			if (params) {
				mutationUrl += '?' + params;
			}

			const response = await client.request({
				...(!!baseURL && { baseURL }),
				url: mutationUrl,
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				data: body,
				...config,
			});

			const json = await response.data;

			resolve(json);
		} catch (error) {
			reject(error);
		}
	});
}

export async function mutationFormData<T>({
	url,
	body,
	method,
	inputParams,
	config,
}: MutationFormDataOptions): Promise<T> {
	let params = '';

	if (inputParams) {
		params = qs.stringify(inputParams);
	}

	return new Promise(async (resolve, reject) => {
		try {
			let mutationUrl = url;

			if (params) {
				mutationUrl += '?' + params;
			}

			const form = new FormData();
			const keys = Object.keys(body);
			const bodyValue = Object.values(body);

			bodyValue.forEach((value, index) => {
				return form.append(keys[index], value);
			});

			const response = await client.request({
				url: mutationUrl,
				method,
				data: form,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				...config,
			});

			const json = await response.data;

			resolve(json);
		} catch (error) {
			reject(error);
		}
	});
}
