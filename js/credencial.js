// js/credencial.js
document.addEventListener("DOMContentLoaded", async () => {

  // ===============================
  // 1. LEER HASH DEL QR
  // ===============================
  let hash = window.location.hash.substring(1);

  // Si NO hay hash → es acceso normal (index)
  if (!hash) {
    console.log("Acceso normal sin QR → mostrar página principal");
    return;
  }

  // Extraer el código del hash
  let codigo = hash.split("|")[0];

  if (!codigo) {
    alert("QR inválido");
    window.location.href = "index.html";
    return;
  }

  console.log("Código detectado por QR:", codigo);

  // ===============================
  // 2. URLs del backend
  // ===============================
  const backendURLVerificar =
    "https://red-de-patas-api-812893065625.us-central1.run.app/api/verificar";

  const backendURLPromedio =
    "https://red-de-patas-api-812893065625.us-central1.run.app/api/promedio";

  try {

    // ===============================
    // 3. VERIFICAR CREDENCIAL EN FIREBASE
    // ===============================
    const resp = await fetch(`${backendURLVerificar}/${codigo}`);
    const data = await resp.json();

    if (!data.ok) {
      alert("❌ Esta credencial NO está registrada en Red de Patas.");
      window.location.href = "index.html";
      return;
    }

    // Mostrar datos
    document.getElementById("nombre").textContent = data.nombre || "—";
    document.getElementById("dni").textContent = data.dni || "—";
    document.getElementById("telefono").textContent = data.telefono || "—";
    document.getElementById("foto").src =
      data.foto || "https://placehold.co/150x170";

    // ===============================
    // 4. CARGAR PROMEDIO DE ESTRELLAS
    // ===============================
    const resp2 = await fetch(`${backendURLPromedio}/${codigo}`);
    const datosCal = await resp2.json();

    const estrellasDiv = document.getElementById("estrellas");

    if (!datosCal.ok || datosCal.votos === 0) {
      estrellasDiv.innerHTML = `
        <span style="color:#555; font-size:1.2rem;">Sin calificación</span>
      `;
    } else {
      const promedio = datosCal.promedio;
      const votos = datosCal.votos;

      let estrellas = "";
      let entero = Math.floor(promedio);

      for (let i = 0; i < 5; i++) {
        estrellas += i < entero ? "★" : "☆";
      }

      estrellasDiv.innerHTML = `
        <div style="font-size:2.2rem; color:#f8c200;">${estrellas}</div>
        <div style="font-size:1rem; color:#1e293b; margin-top:3px;">
          ${promedio} - ${votos} votos
        </div>
      `;
    }

  } catch (error) {
    console.error(error);
    alert("⚠️ Error conectando con el servidor.");
  }

  // ===============================
  // 5. BOTONES
  // ===============================
  document.getElementById("btnCalificar").addEventListener("click", () => {
    window.location.href = `calificar.html?codigo=${codigo}`;
  });

  document.getElementById("btnComentarios").addEventListener("click", () => {
    window.location.href = `comentarios.html?codigo=${codigo}`;
  });

});
