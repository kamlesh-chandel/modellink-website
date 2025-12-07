const STORAGE_KEY = "modellink_models";
const form = document.getElementById("modelForm");
const modelsContainer = document.getElementById("modelsContainer");

form.addEventListener("submit", createModel);
document.addEventListener("DOMContentLoaded", renderModels);

function createModel(e) {
  e.preventDefault();
  const models = getModels();
  const newModel = createNewModel();
  models.push(newModel);
  saveModels(models);
  renderModels();
  form.reset();
}

function renderModels() {
  const models = getModels();
  modelsContainer.innerHTML = "";

  if (models.length === 0) {
    modelsContainer.innerHTML =
      "<p style='color:#ccc'>No models added yet.</p>";
    return;
  }

  models.forEach((model) => {
    const card = document.createElement("div");
    card.className = "model-card";

    card.innerHTML = `
      <img src="${model.image}" alt="${model.name}" />
      <h3>${model.name}</h3>
      <p>${model.category}</p>
    `;

    modelsContainer.appendChild(card);
  });
}

function getModels() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveModels(models) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

function createNewModel() {
  return {
    id: getModels().length+1,
    name: document.getElementById("modelName").value.trim(),
    category: document.getElementById("modelCategory").value.trim(),
    image: document.getElementById("modelImage").value.trim(),
    createdAt: new Date(),
  };
}
