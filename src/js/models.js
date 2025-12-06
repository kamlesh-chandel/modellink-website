const STORAGE_KEY = "modellink_models";
const form = document.getElementById("modelForm");
form.addEventListener("submit", createModel);

function createModel(e) {
  e.preventDefault();
  const models = getModels();
  const newModel = createNewModel();
  models.push(newModel);
  saveModels(models);
  form.reset();
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
    bio: document.getElementById("modelBio").value.trim(),
    createdAt: new Date(),
  };
}
