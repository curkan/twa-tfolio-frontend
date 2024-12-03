import {ref} from "vue";
import type {GridData} from "../types/grid.type";
import testUserDate from "@/configs/userData.config";
import axios from "axios";

export const gridData = ref<GridData>()

export const useUploadImage = async (
  formData: FormData
) => {
    const apiUrl = 'http://backend.tgfolio.tg.localhost:81/api/v1/common/upload-image';

    axios.postForm(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + testUserDate
        },
      })
      .then((response) => {
        return response.data.data.node
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

}

