import api from "./APi_use";

export const getUsers = async (cedula) => {
  let url = `/buscar-deuda/${cedula}`;
  try {
    const result = await api.get(url, {
      headers: {
        'Access-Control-Allow-Origin': '*', 

      },
    });

    console.log(result.data);
    return result.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
