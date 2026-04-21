import { IMetabotServiceResponse } from "@utils/interface";
import { checkUserIntent } from "./intent.service";
import { Retrieve } from "./retrieve.service";
import { NotesModel } from "@models/notes.model";

export const triggerMetabotService = async (message: string): Promise<IMetabotServiceResponse> => {
  try {
    const { success, intent, confidence } = await checkUserIntent(message);
    if (!success || !intent || confidence === undefined) {
      return { success: false, message: "Error classifying user intent" };
    }

    if (intent === "info" || confidence <= 0.7) {
      return {
        success: true,
        message:
          "I am Metabot! I can help you find notes from Metaverse archives. Try asking 'metabot find my RL notes'.",
      };
    }

    const filterResponse = await Retrieve.getFiltersFromUserQuery(message);
    if (!filterResponse.success) {
      return { success: false, message: "Could not extract filters from query" };
    }

    const query = await NotesModel.find(filterResponse.filter).lean();
    if (query.length === 0) {
      return {
        success: true,
        message:
          "I searched the entire Metaverse archives, but I couldn't find those specific notes. Are you sure they've been uploaded to archives? Check and try again!",
      };
    }

    const filteredNotes = query.map(note => ({
      fileName: note.fileName,
      fileUrl: note.fileUrl,
    }));

    const summary = {
      count: query.length,
      subject: filterResponse.filter.subject || "various subjects",
      noteType: filterResponse.filter.noteType || "study materials",
      chapter: filterResponse.filter.chapter || "various chapters",
    };

    const response = await Retrieve.generateFinalResponse(message, summary);
    if (!response.success) {
      return { success: false, message: response.message };
    }

    return { success: true, message: response.message, notes: filteredNotes };
  } catch (error) {
    return {
      success: false,
      message: "Metabot could not generate a response. Please try again later",
    };
  }
};
