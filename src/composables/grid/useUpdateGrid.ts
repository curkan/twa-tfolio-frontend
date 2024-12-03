import {ref} from "vue";
import type {GridData} from "../types/grid.type";
import testUserDate from "@/configs/userData.config";
import axios from "axios";

export const gridData = ref<GridData>()

export const useUpdateGrid = async (
  nodes: any[]
) => {
    const apiUrl = 'http://backend.tgfolio.tg.localhost:81/api/v1/common/grid';

    axios.put(apiUrl, {nodes: nodes}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + testUserDate
        },
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

}

