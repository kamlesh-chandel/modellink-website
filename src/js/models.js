const form = document.getElementById("modelForm");
const container = document.getElementById("modelsContainer");
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
  container.innerHTML = "";

  if (models.length === 0) {
    container.innerHTML = `<p class="no-models">No models added yet.</p>`;
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
    container.appendChild(card);
  });
}

function editModel(id) {
  const models = getModels();
  const model = models.find(({ id: modelId }) => modelId === id);

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
  const models = getModels();

  const updateModels = models.map((model) =>
    model.id === editModelId
      ? {
          ...model,
          name: document.getElementById("modelName").value.trim(),
          category: document.getElementById("modelCategory").value.trim(),
          image: document.getElementById("modelImage").value.trim(),
        }
      : model
  );

  saveModels(updateModels);

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
  return JSON.parse(localStorage.getItem("modellink_models")) || [];
}

function saveModels(models) {
  localStorage.setItem("modellink_models", JSON.stringify(models));
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
