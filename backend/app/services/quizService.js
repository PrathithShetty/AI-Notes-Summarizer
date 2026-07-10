import API from "../api/axios";

export const generateQuiz = async (noteId) => {
    const response = await API.post(
        `/api/quiz/generate/${noteId}`
    );

    return response.data;
};