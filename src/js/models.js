const form = document.getElementById("modelForm");
const container = document.getElementById("modelsContainer");
const submitBtn = document.getElementById("submitBtn");
const modelSectionTitle = document.getElementById("modelSectionTitle");
import {API_BASE_URL} from "../env.js";

let editModelId = null;

form.addEventListener("submit", handleSubmit);
document.addEventListener("DOMContentLoaded", fetchModels);

async function fetchModels() {
  container.innerHTML = "";
  try {
    const res = await fetch(`${API_BASE_URL}/models`);
    const result = await res.json();
    if (!result.success) {
      container.innerHTML = `<p class="error">${result.message}</p>`;
      return;
    }
    const models = result.data;
    if (models.length === 0) {
      container.innerHTML = `<p class="no-models">No models added yet.</p>`;
      return;
    }
    container.innerHTML = "";
    models.forEach((model) => renderModelCard(model));
  } catch (error) {
    console.error("Error fetching models:", error);
    container.innerHTML = `<p class="error">Failed to load models</p>`;
  }
}

function renderModelCard(model) {
  const card = document.createElement("div");
  card.className = "model-card";
  card.innerHTML = `
    <img src="${model.image_url}" alt="${model.name}" />
    <h3>${model.name}</h3>
    <p>${model.category}</p>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;
  card
    .querySelector(".edit-btn")
    .addEventListener("click", () => fillEditForm(model));
  card
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteModel(model._id));

  container.appendChild(card);
}

function handleSubmit(e) {
  e.preventDefault();
  editModelId ? updateModel() : createModel();
}

async function createModel() {
  const model = {
    name: document.getElementById("modelName").value.trim(),
    category: document.getElementById("modelCategory").value.trim(),
    image_url: document.getElementById("modelImage").value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/models`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(model),
    });
    const result = await res.json();
    if (!result.success) {
      alert(result.message);
      return;
    }
    form.reset();
    fetchModels();
    document.getElementById("modelsContainer").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Create failed:", error);
  }
}

function fillEditForm(model) {
  document.getElementById("modelName").value = model.name;
  document.getElementById("modelCategory").value = model.category;
  document.getElementById("modelImage").value = model.image_url;
  editModelId = model._id;
  modelSectionTitle.textContent = "Update Model";
  submitBtn.textContent = "Update";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updateModel() {
  const updatedData = {
    name: document.getElementById("modelName").value.trim(),
    category: document.getElementById("modelCategory").value.trim(),
    image_url: document.getElementById("modelImage").value.trim(),
  };
  try {
    const res = await fetch(`${API_BASE_URL}/models/${editModelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    const result = await res.json();
    if (!result.success) {
      alert(result.message);
      return;
    }
    editModelId = null;
    submitBtn.textContent = "Create Model";
    modelSectionTitle.textContent = "Add New Model";
    form.reset();
    fetchModels();
    document.getElementById("modelsContainer").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Update failed:", error);
  }
}

async function deleteModel(id) {
  const confirmDelete = confirm("Are you sure you want to delete this model?");
  if (!confirmDelete) return;
  try {
    const res = await fetch(`${API_BASE_URL}/models/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (!result.success) {
      alert(result.message);
      return;
    }
    fetchModels();
  } catch (error) {
    console.error("Delete failed:", error);
  }
}
