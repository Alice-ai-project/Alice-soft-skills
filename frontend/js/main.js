const statusEl = document.getElementById("status");
const questionEl = document.getElementById("question");
const optionButtons = Array.from(document.querySelectorAll("[data-answer]"));

let sessionId = null;

async function startInterview() {
  const response = await fetch("/api/interview/start", { method: "POST" });
  const data = await response.json();
  sessionId = data.session_id;
  questionEl.textContent = data.first_question;
  statusEl.textContent = "Avatar leyendo pregunta...";
  setTimeout(() => {
    statusEl.textContent = "Selecciona una respuesta";
    optionButtons.forEach((btn) => (btn.disabled = false));
  }, 1200);
}

async function submitAnswer(answer) {
  optionButtons.forEach((btn) => (btn.disabled = true));
  statusEl.textContent = "Procesando turno...";

  const response = await fetch("/api/interview/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, answer }),
  });
  const data = await response.json();

  if (data.finished) {
    questionEl.textContent = "Entrevista finalizada";
    statusEl.textContent = "Resultados enviados al motor de recomendaciones.";
    return;
  }

  questionEl.textContent = data.next_question;
  statusEl.textContent = "Avatar leyendo pregunta...";
  setTimeout(() => {
    statusEl.textContent = "Selecciona una respuesta";
    optionButtons.forEach((btn) => (btn.disabled = false));
  }, 1200);
}

optionButtons.forEach((btn) => {
  btn.addEventListener("click", () => submitAnswer(btn.dataset.answer));
});

document.addEventListener("DOMContentLoaded", startInterview);
