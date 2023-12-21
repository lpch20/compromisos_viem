import api from "./APi_use";

export const deleteAcuerdo = async (cedula, token) => {
  let url = `/borrarAcuerdo`;
  try {
    const result = await api.put(url, {cedula} ,{
      headers: {
        Authorization: token,
        'Access-Control-Allow-Origin': '*',
      },
    });

    return result.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
