import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import mongoose from "mongoose";

// GET (read)
export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const prompt = await Prompt.findById(params.id).populate("creator");

    // handle if not exists any prompt
    if (!prompt) return new Response("Prompt Not Found!", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response(`Error occure while gettin prompts: ${error.message}`, {
      status: 500,
    });
  }
};

// PATCH (update)
export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectToDB();
    const existingPrompt = await Prompt.findById(params.id);

    // handle if not exists any prompt
    if (!existingPrompt)
      return new Response("Prompt Not Found!", { status: 404 });

    // else update data of post
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();
    return new Response("Successfully updated the prompt", { status: 200 });
  } catch (error) {
    return new Response(`Error occure while updating prompt`, {
      status: 500,
    });
  }
};

// DELETE (delete)
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return new Response("Invalid ID format", { status: 400 });
    }

    const deletingPrompt = await Prompt.findById(params.id);

    if (!deletingPrompt) {
      return new Response("Prompt Not Found!", { status: 404 });
    }

    await Prompt.findByIdAndDelete(params.id);
    return new Response("Successfully removed the prompt", { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(`Error occurred while removing prompt`, {
      status: 500,
    });
  }
};
