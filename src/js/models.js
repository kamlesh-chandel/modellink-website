const STORAGE_KEY = "modellink_models";
const form = document.getElementById("modelForm");
const modelsContainer = document.getElementById("modelsContainer");
const submitBtn = document.getElementById("submitBtn");

let editModelId = null;

form.addEventListener("submit", handleSubmit);
document.addEventListener("DOMContentLoaded", renderModels);

function handleSubmit(e) {
  e.preventDefault();

  if (editModelId) {
    updateModel();
  } else {
    createModel();
  }
}

function createModel(e) {
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
    modelsContainer.innerHTML = `<p class="no-models">No models added yet.</p>`;
    return;
  }

  models.forEach((model) => {
    const card = document.createElement("div");
    card.className = "model-card";

    card.innerHTML = `
      <img src="${model.image}" alt="${model.name}" />
      <h3>${model.name}</h3>
      <p>${model.category}</p>
      <button onclick="editModel(${model.id})" class="edit-btn">
        Edit
      </button>
      <button class="delete-btn" onclick="deleteModel(${model.id})">Delete</button>
    `;
    modelsContainer.appendChild(card);
  });
}

function editModel(id) {
  const models = getModels();
  const model = models.find((m) => m.id === id);

  if (!model) return;

  document.getElementById("modelName").value = model.name;
  document.getElementById("modelCategory").value = model.category;
  document.getElementById("modelImage").value = model.image;

  editModelId = id;
  submitBtn.textContent = "Update Model";
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function updateModel() {
  let models = getModels();

  models = models.map((model) =>
    model.id === editModelId
      ? {
          ...model,
          name: document.getElementById("modelName").value.trim(),
          category: document.getElementById("modelCategory").value.trim(),
          image: document.getElementById("modelImage").value.trim(),
        }
      : model
  );

  saveModels(models);

  editModelId = null;
  submitBtn.textContent = "Create Model";
  form.reset();
  renderModels();
}

function deleteModel(id) {
  const confirmDelete = confirm("Are you sure you want to delete this model?");
  if (!confirmDelete) return;

  const models = getModels().filter((model) => model.id !== id);

  saveModels(models);
  renderModels();
}

function getModels() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveModels(models) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

function createNewModel() {
  return {
    id: getModels().length + 1,
    name: document.getElementById("modelName").value.trim(),
    category: document.getElementById("modelCategory").value.trim(),
    image: document.getElementById("modelImage").value.trim(),
    createdAt: new Date(),
  };
}
