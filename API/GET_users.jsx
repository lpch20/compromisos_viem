import api from "./APi_use";

export const getUsers = async (cedula) => {
  let url = `/buscar-deuda/${cedula}`;
  try {
    const result = await api.get(url, {
      headers: {
        'Access-Control-Allow-Origin': '*', 

      },
    });
    return result.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
export const buscarUsuario = async (cedula) => {
  let url = `/busquedaUsuario/${cedula}`;
  try {
    const result = await api.get(url, {
      headers: {
        'Access-Control-Allow-Origin': '*', 

      },
    });
    return result.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
