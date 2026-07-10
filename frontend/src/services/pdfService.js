import API from "../api/axios";

export const uploadPDF = async (formData) => {
    const response = await API.post(
        "/api/pdf/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};