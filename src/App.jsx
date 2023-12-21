import { useState, useEffect } from "react";
import "./App.css";
import { getUsers } from "../API/GET_users";
import { changeUser } from "../API/PUT_users";
import { deleteAcuerdo } from "../API/DELETE_users";
import { useNavigate } from "react-router-dom";

function App() {
  const token = localStorage.getItem("token");

  const [cedula, setCedula] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [montoDeAcuerdo, setMontoDeAcuerdo] = useState("");
  const [valueToChange, setValueToChange] = useState(0);
  const [agenteAdd, setAgente] = useState("");
  const [cartera, setCartera] = useState("");
  const [checkCdc, setCheckCdc] = useState(false);
  const [checkCreditel, setCheckCreditel] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCedula(e.target.value);
  };

  const handleChangeUpdate = (e) => {
    setValueToChange(e.target.value);
  };

  const handleAgente = (e) => {
    setAgente(e.target.value);
  };

  const searchUsers = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userResult = await getUsers(cedula);
      setMontoDeAcuerdo(userResult.monto_de_acuerdo);
      setCartera(userResult.carteras);
      if (userResult) {
        setUserData(userResult);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error(error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const addAgenteAndChangeUserData = async (e) => {
    e.preventDefault();
    setLoading2(true);

    try {
      // await addAgent(cedula, agenteAdd);

      await changeUser(
        cedula,
        valueToChange,
        cartera,
        checkCdc,
        checkCreditel,
        agenteAdd,
        token
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading2(false);
    }
  };

  const deleteAcuerdoData = async (e) => {
    e.preventDefault();
    setLoading3(true);

    try {
      await deleteAcuerdo(cedula, token);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading3(false);
    }
  };

  const handleCheckboxChangeCdc = () => {
    setCheckCdc((prevCheckCdc) => !prevCheckCdc);
  };

  const handleCheckboxChangeCreditel = () => {
    setCheckCreditel((prevCheckCreditel) => !prevCheckCreditel);
  };

  const exit = () =>{
    localStorage.clear()
    navigate("/");
  }

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [checkCdc, checkCreditel]);

  return (
    <>
      <div className="container">
        <form className="containerForm" onSubmit={searchUsers}>
          <h3>Buscar Cedula</h3>
          <input
            id="ciInput"
            type="number"
            value={cedula}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>

          {userData && (
            <div>
              {cartera.includes("CREDITEL") &&
              cartera.includes("CREDITO DE LA CASA") &&
              checkCdc &&
              checkCreditel ? (
                <div>
                  <p>
                    <b>Cedula encontrada:</b> {userData.cedula}
                  </p>
                  <p>
                    <b>Nombre:</b> {userData.nombre}
                  </p>
                  <p>
                    <b>Contado CDC + Creditel:</b>
                    {+userData.contadoCdc + +userData.contadoCreditel}
                  </p>
                  <p>
                    <b>Financiar Creditel + CDC:</b>{" "}
                    {+userData.financiarCreditel + +userData.financiarCdc}
                  </p>
                  <p>
                    <b>Monto de acuerdo CDC + Creditel:</b>{" "}
                    {userData.monto_de_acuerdo}
                  </p>
                </div>
              ) : cartera.includes("CREDITEL") &&
                cartera.includes("CREDITO DE LA CASA") &&
                checkCreditel &&
                !checkCdc ? (
                <div>
                  <p>
                    <b>Cedula encontrada:</b> {userData.cedula}
                  </p>
                  <p>
                    <b>Nombre:</b> {userData.nombre}
                  </p>
                  <p>
                    <b>Contado Creditel:</b>
                    {+userData.contadoCreditel}
                  </p>
                  <p>
                    <b>Financiar Creditel:</b> {+userData.financiarCreditel}
                  </p>
                  <p>
                    <b>Monto de acuerdo Creditel:</b>{" "}
                    {userData.monto_de_acuerdo}
                  </p>
                </div>
              ) : cartera.includes("CREDITEL") &&
                cartera.includes("CREDITO DE LA CASA") &&
                checkCdc &&
                !checkCreditel ? (
                <div>
                  <p>
                    <b>Cedula encontrada:</b> {userData.cedula}
                  </p>
                  <p>
                    <b>Nombre:</b> {userData.nombre}
                  </p>
                  <p>
                    <b>Contado Cdc:</b>
                    {+userData.contadoCdc}
                  </p>
                  <p>
                    <b>Financiar Cdc:</b> {+userData.financiarCdc}
                  </p>
                  <p>
                    <b>Monto de acuerdo Cdc:</b> {userData.monto_de_acuerdo}
                  </p>
                </div>
              ) : cartera.includes("CREDITEL") ? (
                <div>
                  <p>
                    <b>Cedula encontrada:</b> {userData.cedula}
                  </p>
                  <p>
                    <b>Nombre:</b> {userData.nombre}
                  </p>
                  <p>
                    <b>Contado Creditel:</b>
                    {+userData.contadoCreditel}
                  </p>
                  <p>
                    <b>Financiar Creditel:</b> {+userData.financiarCreditel}
                  </p>
                  <p>
                    <b>Monto de acuerdo Creditel:</b>{" "}
                    {userData.monto_de_acuerdo}
                  </p>
                </div>
              ) : cartera.includes("CREDITO DE LA CASA") ? (
                <div>
                  <p>
                    <b>Cedula encontrada:</b> {userData.cedula}
                  </p>
                  <p>
                    <b>Nombre:</b> {userData.nombre}
                  </p>
                  <p>
                    <b>Contado CDC:</b>
                    {+userData.contadoCdc}
                  </p>
                  <p>
                    <b>Financiar CDC:</b> {+userData.financiarCdc}
                  </p>
                  <p>
                    <b>Monto de acuerdo CDC:</b> {userData.monto_de_acuerdo}
                  </p>
                </div>
              ) : null}
            </div>
          )}
          {cartera.includes("CREDITEL") &&
          cartera.includes("CREDITO DE LA CASA") ? (
            <div>
              <label htmlFor="">Credito de la Casa</label>
              <input
                checked={checkCdc}
                onChange={handleCheckboxChangeCdc}
                type="checkbox"
              />
              <label htmlFor="">Creditel</label>
              <input
                checked={checkCreditel}
                onChange={handleCheckboxChangeCreditel}
                type="checkbox"
              />
            </div>
          ) : null}
        </form>
        <form className="containerForm" onSubmit={addAgenteAndChangeUserData}>
          <h3>Agente que carga el compromiso</h3>
          <input value={agenteAdd} onChange={handleAgente} type="text" />

          <h3>Monto arreglado en compromiso</h3>
          <input
            value={valueToChange}
            onChange={handleChangeUpdate}
            type="number"
          />

          {!userData || valueToChange === 0 || !agenteAdd ? (
            <button disabled>
              {loading2 ? "Cargando Convenio....." : "Cargar Convenio"}
            </button>
          ) : (
            <button>
              {loading2 ? "Cargando Convenio....." : "Cargar Convenio"}
            </button>
          )}
        </form>

        {montoDeAcuerdo === null || montoDeAcuerdo < 1 ? (
          <button className="clearButton" onClick={deleteAcuerdoData} disabled>
            {loading3 ? "Eliminando....." : "Eliminar Convenio"}
          </button>
        ) : (
          <button className="clearButton" onClick={deleteAcuerdoData}>
            {loading3 ? "Eliminando....." : "Eliminar Convenio"}
          </button>
        )}

        <button onClick={exit}>SALIR</button>
      </div>
    </>
  );
}

export default App;
