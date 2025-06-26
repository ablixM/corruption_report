import axios, { AxiosRequestConfig, AxiosProgressEvent } from "axios";

export interface FetchResponse<T> {
  size: number;
  page: number;
  totalElements: number;
  totalPages: number;
  results: T[];
}
export const api = axios.create({
  baseURL: "https://yeka.aromaxtrading.com/api",
  withCredentials: true,
  timeout: 10000,
});

export class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = (config: AxiosRequestConfig) => {
    return api
      .get<FetchResponse<T>>(this.endpoint, config)
      .then((res) => res.data);
  };

  getBySlug = (slug: string) => {
    return api.get<T>(`${this.endpoint}/${slug}`).then((res) => res.data);
  };
  getAllNonPaginated = (config: AxiosRequestConfig) => {
    return api.get<T[]>(this.endpoint, config).then((res) => res.data);
  };

  get = (token: string) => {
    // For authenticated requests, use api which will handle token refreshing
    return api
      .get<T>(this.endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);
  };

  getById = (id: number | string) => {
    // Use the authenticated api instance for all requests to ensure proper token handling
    return api.get<T>(this.endpoint + "/" + id).then((res) => res.data);
  };

  // For authenticated POST requests
  post = <D>(
    data: D,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ) => {
    return api
      .post<T>(this.endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      })
      .then((res) => res.data);
  };

  // For authenticated PUT requests
  put = <D>(data: D, id: string | undefined) => {
    return api.put<T>(this.endpoint + "/" + id, data).then((res) => res.data);
  };

  // For authenticated POST requests with JSON
  postJson = <D>(data: D) => {
    return api
      .post<T>(this.endpoint, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data);
  };

  // For authenticated PUT requests with JSON
  putJson = <D>(data: D, id: string | undefined) => {
    return api
      .put<T>(this.endpoint + "/" + id, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data);
  };
}
