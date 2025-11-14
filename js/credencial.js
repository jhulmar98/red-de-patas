document.addEventListener("DOMContentLoaded", async () => {

  // LEER HASH DEL QR
  let hash = window.location.hash.substring(1);

  // SI NO HAY HASH → REDIRIGIR A LA PÁGINA PRINCIPAL
  if (!hash) {
    console.log("Acceso sin QR, enviando a index.html");
    window.location.href = "index.html";
    return;
  }

  // SI HAY HASH → EXTRAER CÓDIGO
  let codigo = hash.split("|")[0];

  if (!codigo) {
    alert("QR inválido");
    window.location.href = "index.html";
    return;
  }

  console.log("QR detectado:", codigo);

  // URLs DEL BACKEND
  const backendURLVerificar =
    "https://red-de-patas-api-812893065625.us-central1.run.app/api/verificar";

  const backendURLPromedio =
    "https://red-de-patas-api-812893065625.us-central1.run.app/api/promedio";

  try {
    // VERIFICAR CREDENCIAL
    const resp = await fetch(`${backendURLVerificar}/${codigo}`);
    const data = await resp.json();

    // SI NO EXISTE EN FIREBASE → PÁGINA ESPECIAL
    if (!data.ok) {
      console.log("Credencial no encontrada");
      window.location.href = "no-encontrado.html";
      return;
    }

    // RELLENAR DATOS EN credencial.html
    document.getElementById("nombre").textContent = data.nombre || "—";
    document.getElementById("dni").textContent = data.dni || "—";
    document.getElementById("telefono").textContent = data.telefono || "—";

    document.getElementById("foto").src =
      data.foto || "https://placehold.co/150x170";

    // CARGAR PROMEDIO
    const resp2 = await fetch(`${backendURLPromedio}/${codigo}`);
    const datosCal = await resp2.json();

    const estrellasDiv = document.getElementById("estrellas");

    if (!datosCal.ok || datosCal.votos === 0) {
      estrellasDiv.innerHTML = `<span style="color:#555;">Sin calificación</span>`;
    } else {
      let estrellas = "";
      let entero = Math.floor(datosCal.promedio);

      for (let i = 0; i < 5; i++) estrellas += i < entero ? "★" : "☆";

     estrellasDiv.innerHTML = `
      <div style="font-size:1.6rem; color:#f8c200; margin-bottom:6px;">
        ${estrellas}
      </div>
    
      <div style="font-size:1.2rem; font-weight:600; color:#444;">
        ${datosCal.promedio} <span style="color:#999;">–</span> ${datosCal.votos} votos
      </div>
    `;

    }

  } catch (err) {
    console.error(err);
    alert("Error conectando con el servidor");
  }

  // BOTONES
  document.getElementById("btnCalificar").addEventListener("click", () => {
    window.location.href = `calificar.html?codigo=${codigo}`;
  });

  document.getElementById("btnComentarios").addEventListener("click", () => {
    window.location.href = `comentarios.html?codigo=${codigo}`;
  });

});

