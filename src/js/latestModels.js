const homeModelsWrapper = document.querySelector("#latestModelsContainer");
import {API_BASE_URL} from "../config.js";

async function loadLatestModels() {
  try {
    const res = await fetch(`${API_BASE_URL}/models/latest`);
    const result = await res.json();
    if (!result.success) {
      homeModelsWrapper.innerHTML = `<p class="error">${result.message}</p>`;
      return;
    }
    const models = result.data;
    if (models.length === 0) {
      homeModelsWrapper.innerHTML = `<p class="no-models">No models added yet.</p>`;
      return;
    }
    homeModelsWrapper.innerHTML = "";
    models.forEach((model) => {
      const {image_url, name, category} = model;
      const card = document.createElement("div");
      card.className = "model-card";
      card.innerHTML = `
        <img src="${image_url}" alt="${name}" />
        <h3>${name}</h3>
        <p>${category}</p>
      `;
      homeModelsWrapper.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load homepage models:", error);
    homeModelsWrapper.innerHTML = `<p class="error">Failed to load models</p>`;
  }
}

loadLatestModels();
