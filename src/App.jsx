import { useState, useEffect } from "react";
import "./App.css";
import { getUsers } from "../API/GET_users";
import { changeUser } from "../API/PUT_users";
import { deleteAcuerdo } from "../API/DELETE_users";
import { useNavigate } from "react-router-dom";
import Hearder from "./components/Hearder";
import Swal from "sweetalert2";

function App() {
  const token = localStorage.getItem("token");

  const [cedula, setCedula] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [montoDeAcuerdo, setMontoDeAcuerdo] = useState("");
  const [valueToChange, setValueToChange] = useState();
  const [agenteAdd, setAgente] = useState("");
  const [cartera, setCartera] = useState("");
  const [checkCdc, setCheckCdc] = useState(false);
  const [checkCreditel, setCheckCreditel] = useState(true);
  const [inactiveTime, setInactiveTime] = useState(0);
  const navigate = useNavigate();

  const verifyToken = () => {
    if (!token) {
      navigate("/");
    } else {
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));

      setAgente(decodedPayload.username);
    }
  };

  const handleChange = (e) => {
    setCedula(e.target.value);
  };

  const handleChangeUpdate = (e) => {
    setValueToChange(e.target.value);
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
      Swal.fire({
        title: "Compromiso Cargado",
        text: 'Para comprobar si el compromiso quedo cargado correctamente, coloque la cedula del cliente y presione buscar nuevamente, podra ver en el campo "monto de acuerdo" el acuerdo que usted ingreso',
        icon: "success",
        confirmButtonText: "Aceptar",
      });
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
      Swal.fire({
        title: "Compromiso eliminado",
        text: 'Para comprobar si el compromiso quedo eliminado correctamente, coloque la cedula del cliente y presione buscar nuevamente, podra ver en el campo "monto de acuerdo" que existia, no se visualiza mas',
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleCheckboxChangeCdc = () => {
    setCheckCdc((prevCheckCdc) => !prevCheckCdc);
  };

  const handleCheckboxChangeCreditel = () => {
    setCheckCreditel((prevCheckCreditel) => !prevCheckCreditel);
  };

  const everCheck = () => {
    return !checkCdc && !checkCreditel;
  };

  useEffect(() => {
    verifyToken()

    if (!token) {
      navigate("/");
    }

    if (everCheck()) {
      setCheckCreditel(true);
    }
  }, [checkCdc, checkCreditel]);

  useEffect(() => {
    // Función para reiniciar el contador de inactividad
    const resetInactiveTime = () => setInactiveTime(0);

    // Asigna el evento de movimiento del mouse para reiniciar el contador
    window.addEventListener("mousemove", resetInactiveTime);
    // Asigna el evento de pulsación de teclas para reiniciar el contador
    window.addEventListener("keydown", resetInactiveTime);

    // Función para manejar el temporizador de inactividad
    const handleInactiveTimer = () => {
      setInactiveTime((prevInactiveTime) => prevInactiveTime + 1);

      // Si la inactividad es mayor o igual a 15 minutos (900 segundos), realiza la acción deseada
      if (inactiveTime >= 900) {
        // Limpia el Local Storage y redirige al usuario a la página de inicio
        localStorage.clear();
        navigate("/");
      }
    };

    // Establece un temporizador para verificar la inactividad cada segundo
    const timerId = setInterval(handleInactiveTimer, 1000);

    // Limpia los eventos y el temporizador al desmontar el componente
    return () => {
      window.removeEventListener("mousemove", resetInactiveTime);
      window.removeEventListener("keydown", resetInactiveTime);
      clearInterval(timerId);
    };
  }, [inactiveTime]);

  return (
    <>
      <div className="container">
        <Hearder></Hearder>
        <section className="allItems">
          <div className="forms">
            <form className="containerForm" onSubmit={searchUsers}>
              <div className="sectionOfModifyClient">
                <div className="searchCedula">
                  <div className="subClassSearchCi">
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
                  </div>
                  <div className="agentCharge">
                    <h3>Cobrador que carga el compromiso</h3>
                    <input disabled value={agenteAdd} type="text" />
                  </div>
                </div>
              </div>
            </form>

            <form
              className="containerFormAgentAdd"
              onSubmit={addAgenteAndChangeUserData}
            >
              <div className="itemsFormAgentAdd">
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
              </div>
            </form>
          </div>
          <div className="sectionOfVisualData">
            <h2>DATOS DEL CLIENTE</h2>
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
                      {" $" +
                        (
                          Number(userData.contadoCdc) +
                          Number(userData.contadoCreditel)
                        ).toFixed(0)}
                    </p>
                    <p>
                      <b>Financiar Creditel + CDC:</b>
                      {" $" +
                        (
                          Number(userData.financiarCreditel) +
                          Number(userData.financiarCdc)
                        ).toFixed(0)}
                    </p>
                    <p>
                      <b>Monto de acuerdo CDC + Creditel:</b>{" "}
                      {" $" + Number(userData.monto_de_acuerdo).toFixed(0)}
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
                      {" $" + Number(userData.contadoCreditel).toFixed(0)}
                    </p>
                    <p>
                      <b>Financiar Creditel:</b>{" "}
                      {" $" + Number(userData.financiarCreditel).toFixed(0)}
                    </p>
                    <p>
                      <b>Monto de acuerdo Creditel:</b>{" "}
                      {" $" + Number(userData.monto_de_acuerdo).toFixed(0)}
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
                      {" $" + Number(userData.contadoCdc).toFixed(0)}
                    </p>
                    <p>
                      <b>Financiar Cdc:</b>{" "}
                      {" $" + Number(userData.financiarCdc).toFixed(0)}
                    </p>
                    <p>
                      <b>Monto de acuerdo Cdc:</b>{" "}
                      {" $" + Number(userData.monto_de_acuerdo).toFixed(0)}
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
                      {" $" + Number(userData.contadoCreditel).toFixed(0)}
                    </p>
                    <p>
                      <b>Financiar Creditel:</b>{" "}
                      {" $" + Number(userData.financiarCreditel).toFixed(0)}
                    </p>
                    <p>
                      <b>Monto de acuerdo Creditel:</b>
                      {" $" + Number(userData.monto_de_acuerdo).toFixed(0)}
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
                      {" $" + Number(userData.contadoCdc).toFixed(0)}
                    </p>
                    <p>
                      <b>Financiar CDC:</b>{" "}
                      {" $" + Number(userData.financiarCdc).toFixed(0)}
                    </p>
                    <p>
                      <b>Monto de acuerdo CDC:</b>{" "}
                      {" $" + Number(userData.monto_de_acuerdo).toFixed(0)}
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

            {montoDeAcuerdo === null || montoDeAcuerdo < 1 ? (
              <button
                className="clearButton"
                onClick={deleteAcuerdoData}
                disabled
              >
                {loading3 ? "Eliminando....." : "Eliminar Convenio"}
              </button>
            ) : (
              <button className="clearButton" onClick={deleteAcuerdoData}>
                {loading3 ? "Eliminando....." : "Eliminar Convenio"}
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
