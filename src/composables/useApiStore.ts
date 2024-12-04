import { defineStore } from 'pinia'
import { useHttpStore } from './useHttpStore'
import type { AxiosError, AxiosResponse } from 'axios'
// import { useSpinnerStore } from '@/stores/useSpinnerStore'
// import { useSnackBarStore } from '@/stores/useSnackBarStore'

export const useApiStore = defineStore('useApiStore', () => {
  const { http } = useHttpStore()
  // const errorModalStore = useErrorModalStore()
  // const spinnerStore = useSpinnerStore()
  // const snackBarStore = useSnackBarStore()

  function get(url: string, config = {}, snackBarText = ''): Promise<AxiosResponse | void | any> {
    // spinnerStore.showSpinner() // Optional (if we have a centralized loader to show)
    return http
      .get(url, config)
      .then((response) => {
        if (snackBarText) {
          // Optional, if we want to show SnackBar for some success responses (eg data update))
          // snackBarStore.showSnackBar(snackBarText)
        }
        return response?.data
      })
      .catch((error: AxiosError) => {
        // errorModalStore.showErrorModal(errorModalStore.title, error.message)
        return false
      })
      .finally(() => {
        // spinnerStore.hideSpinner() // Optional
      })
  }

  function post(
    url: string,
    data = {},
    config = {},
    snackBarText = '',
  ): Promise<AxiosResponse | void | any> {
    // spinnerStore.showSpinner() // Optional (if we have a centralized loader to show)
    return http
      .post(url, data, config)
      .then((response) => {
        if (snackBarText) {
          // Optional, if we want to show SnackBar for some success responses (eg data update))
          // snackBarStore.showSnackBar(snackBarText)
        }

        return response?.data
      })
      .catch((error: AxiosError) => {
        // errorModalStore.showErrorModal(errorModalStore.title, error.message)
        return false
      })
      .finally(() => {
        // spinnerStore.hideSpinner() // Optional
      })
  }

  function postForm(
    url: string,
    data: FormData,
    config = {},
    snackBarText = '',
  ): Promise<AxiosResponse | void | any> {
    // spinnerStore.showSpinner() // Optional (if we have a centralized loader to show)
    return http
      .postForm(url, data, config)
      .then((response) => {
        if (snackBarText) {
          // Optional, if we want to show SnackBar for some success responses (eg data update))
          // snackBarStore.showSnackBar(snackBarText)
        }

        return response?.data
      })
      .catch((error: AxiosError) => {
        // errorModalStore.showErrorModal(errorModalStore.title, error.message)
        return false
      })
      .finally(() => {
        // spinnerStore.hideSpinner() // Optional
      })
  }

  function put(
    url: string,
    data = {},
    config = {},
    snackBarText = '',
  ): Promise<AxiosResponse | void | any> {
    // spinnerStore.showSpinner() // Optional (if we have a centralized loader to show)
    return http
      .put(url, data, config)
      .then((response) => {
        if (snackBarText) {
          // Optional, if we want to show SnackBar for some success responses (eg data update))
          // snackBarStore.showSnackBar(snackBarText)
        }

        return response?.data
      })
      .catch((error: AxiosError) => {
        // errorModalStore.showErrorModal(errorModalStore.title, error.message)
        return false
      })
      .finally(() => {
        // spinnerStore.hideSpinner() // Optional
      })
  }

  return { get, post, put, postForm }
})
