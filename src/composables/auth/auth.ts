import testUserDate from '@/configs/userData.config'
import {ref} from 'vue'
import {useWebApp} from 'vue-tg'
import axios from 'axios';


const { initData } = useWebApp()

const initDataSate = ref()
export const useAuth = async () => {
    if (process.env.NODE_ENV === 'development') {
      initDataSate.value = testUserDate
    }

    const apiUrl = 'http://backend.tgfolio.tg.localhost:81/api/v1/common/me';

    axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + testUserDate
        }
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    // if ($store.$userInfo === undefined) {
    //     const result = await Api.get(btoa(initDataState.value as string), '/common/me')
    //
    //     if (result?.error.value) {
    //         return navigateTo('/unauthorized')
    //     } else {
    //         const resp = result.resp as Ref<ApiResponse<User>>
    //         $store.$userInfo = resp.value.data
    //         $store.$initData = initData
    //     }
    // }
}


