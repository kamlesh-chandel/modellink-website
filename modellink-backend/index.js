import express from "express";
import mongoose from "mongoose";
import Model from "./models/model.model.js";
import cors from "cors";

const MONGO_URI ="mongodb+srv://kamleshchandel17_db_user:kamlesh@cluster0.v4nqadz.mongodb.net/modellink";

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
    return res.status(201).json({
      success: true,
      message: "Model created successfully",
      data: newModel,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

app.get("/api/v1/models", async (req, res) => {
  try {
    const models = await Model.find().sort({ _id: -1 });
    return res.status(200).json({
      success: true,
      message: "Models fetched successfully",
      data: models,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

app.get("/api/v1/models/latest", async (req, res) => {
  try {
    const models = await Model.find().sort({ _id: -1 }).limit(3);

    return res.status(200).json({
      success: true,
      message: "Latest models fetched successfully",
      data: models,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

app.put("/api/v1/models/:id", async (req, res) => {
  try {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Model updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

app.delete("/api/v1/models/:id", async (req, res) => {
  try {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Model deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

app.listen(3000, () => {
    connectDB();
    console.log("Server is running on port 3000");
});