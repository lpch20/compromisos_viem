import api from "./APi_use";

export const changeUser = async (cedula, valueToChange ,cartera, checkCdc, checkCreditel, agenteAdd, token) => {
  let url = `/cambiarAcuerdo`;
  try {
    const result = await api.put(url, { cedula, valueToChange,  cartera, checkCdc, checkCreditel, agenteAdd}, {
      headers: {
        Authorization: token ,
        'Access-Control-Allow-Origin': '*',
      },
    });

    return result.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
