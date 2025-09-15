import { AxiosRequestConfig } from 'axios';

export type MutationMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface FetchOptions {
	url: string;
	inputParams?: { [key: string]: string | number };
}

export interface MutationDataOptions {
	url: string;
	method: MutationMethodType;
	body?: { [key: string]: any };
	baseURL?: string;
	inputParams?: { [key: string]: any };
	config?: AxiosRequestConfig;
}

export interface MutationFormDataOptions {
	url: string;
	method: MutationMethodType;
	body: { [key: string]: any };
	baseURL?: string;
	inputParams?: { [key: string]: any };
	config?: AxiosRequestConfig;
}

export interface ApiError {
	response: {
		data: {
			message: string;
			status: number;
		};
	};
}

export interface MetaType {
	isFirstPage: boolean;
	isLastPage: boolean;
	currentPage: number;
	previousPage: null | number;
	nextPage: null | number;
	pageCount: number;
	totalCount: number;
}

export interface SuccessResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

export interface SuccessResponsePagination<T> {
	statusCode: number;
	message: string;
	data: T;
	meta: MetaType;
}
