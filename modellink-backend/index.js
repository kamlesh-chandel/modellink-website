import express from "express";
import mongoose from "mongoose";
import Model from "./models/model.model.js";
import cors from "cors";
import dotenv from "dotenv";
import { sendResponse } from "./utils/api.response.js";
import { HTTP_STATUS } from "./utils/httpStatus.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

app.post("/api/v1/models", async (req, res) => {
  try {
    const newModel = await Model.create(req.body);
    return sendResponse(res, HTTP_STATUS.CREATED, true, "Model created successfully", newModel);
  } catch (error) {
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      false,
      error.message,
      null
    );
  }
});

app.get("/api/v1/models", async (req, res) => {
  try {
    const models = await Model.find().sort({ _id: -1 });
    return sendResponse(res, HTTP_STATUS.OK, true, "Models fetched successfully", models);
  } catch (error) {
    return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, error.message, null);
  }
});

app.get("/api/v1/models/latest", async (req, res) => {
  try {
    const models = await Model.find().sort({ _id: -1 }).limit(3);
    return sendResponse(
      res,
      HTTP_STATUS.OK,
      true,
      "Latest models fetched successfully",
      models
    );
  } catch (error) {
    return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, error.message, null);
  }
});

app.put("/api/v1/models/:id", async (req, res) => {
  try {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document, (by default it returns the old document);
    });
    if (!updated) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, false, "Model not found", null);
    }
    return sendResponse(res, HTTP_STATUS.OK, true, "Model updated successfully", updated);
  } catch (error) {
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      false,
      error.message,
      null
    );
  }
});

app.delete("/api/v1/models/:id", async (req, res) => {
  try {
    const deleted_model = await Model.findByIdAndDelete(req.params.id);
    if (!deleted_model) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, false, "Model not found", null);
    }
    return sendResponse(res, HTTP_STATUS.OK, true, "Model deleted successfully", null);
  } catch (error) {
    return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, error.message, null);
  }
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
