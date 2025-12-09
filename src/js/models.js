let db;

const form = document.getElementById("modelForm");
const container = document.getElementById("modelsContainer");
const submitBtn = document.getElementById("submitBtn");

let editModelId = null;

form.addEventListener("submit", handleSubmit);
document.addEventListener("DOMContentLoaded", initDB);

function initDB() {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = (e) => { //it runs when db is created for the first time,
    const database = e.target.result;
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      database.createObjectStore(STORE_NAME, {
        keyPath: "id",
      });
    }
  };
  request.onsuccess = () => {
    db = request.result;
    renderModels();
  };
  request.onerror = () => {
    console.error("Failed to open IndexedDB");
  };
}

function handleSubmit(e) {
  e.preventDefault();
  if (editModelId !== null) {
    updateModel();
  } else {
    createModel();
  }
}

function createModel() {
  const model = createNewModel();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.add(model);
  transaction.oncomplete = () => {
    form.reset();
    renderModels();
  };
}

function renderModels() {
  container.innerHTML = "";
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();
  request.onsuccess = () => {
    const models = request.result;
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
        <button class="edit-btn">
          Edit
        </button>
        <button class="delete-btn">
          Delete
        </button>
      `;
      card.querySelector(".edit-btn").addEventListener("click",() => editModel(model.id));
      card.querySelector(".delete-btn").addEventListener("click",() => deleteModel(model.id));
      container.appendChild(card);
    });
  };
}

function editModel(id) {
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(id);
  request.onsuccess = () => {
    const model = request.result;
    if (!model) return;
    document.getElementById("modelName").value = model.name;
    document.getElementById("modelCategory").value = model.category;
    document.getElementById("modelImage").value = model.image;
    editModelId = id;
    submitBtn.textContent = "Update Model";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

function updateModel() {
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  const updatedModel = {
    id: editModelId,
    name: document.getElementById("modelName").value.trim(),
    category: document.getElementById("modelCategory").value.trim(),
    image: document.getElementById("modelImage").value.trim(),
    createdAt: new Date().toISOString(),
  };
  store.put(updatedModel);
  transaction.oncomplete = () => {
    editModelId = null;
    submitBtn.textContent = "Create Model";
    form.reset();
    renderModels();
  };
}

function deleteModel(id) {
  const confirmDelete = confirm("Are you sure you want to delete this model?");
  if (!confirmDelete) return;
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.delete(id);
  transaction.oncomplete = () => {
    renderModels();
  };
}

function createNewModel() {
  return {
    id: Date.now(),
    name: document.getElementById("modelName").value.trim(),
    category: document.getElementById("modelCategory").value.trim(),
    image: document.getElementById("modelImage").value.trim(),
    createdAt: new Date().toISOString(),
  };
}
