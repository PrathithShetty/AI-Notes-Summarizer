import { useRef, useState } from "react";
import { uploadPDF } from "../services/pdfService";

function UploadCard({ onSummaryGenerated }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        setError("");
        setSuccess("");

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            setFile(null);

            setError("Please select a valid PDF file.");

            e.target.value = "";

            return;
        }

        setFile(selectedFile);
    };


    const handleUpload = async () => {
        if (loading) {
            return;
        }

        if (!file) {
            setError("Please select a PDF first.");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            // Remove previously generated notes
            onSummaryGenerated(null);

            const response = await uploadPDF(formData);
            console.log("UPLOAD RESPONSE:", response);


            // Validate generated notes
            if (!response.summary) {
                throw new Error(
                    "The server did not return generated notes."
                );
            }


            // Validate saved note
            if (!response.note || !response.note.id) {
                throw new Error(
                    "The server did not return the saved note ID."
                );
            }


            // Send notes + database note ID to Dashboard
            onSummaryGenerated({
                notes: response.summary,
                noteId: response.note.id,
            });


            setSuccess(
                `Study notes generated successfully from ${file.name}.`
            );


            // Clear selected PDF
            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }


            // Scroll toward generated notes
            setTimeout(() => {
                const notesSection =
                    document.querySelector(".notes-section");

                notesSection?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 150);

        } catch (error) {
            console.error("PDF UPLOAD ERROR:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to generate notes. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="card shadow-sm border-0 upload-card">

            <div className="card-body p-4 p-md-5">

                {/* Upload Header */}

                <div className="text-center mb-4">

                    <div className="upload-icon">
                        📄
                    </div>

                    <h2 className="upload-title">
                        Upload Study Material
                    </h2>

                    <p className="upload-description">
                        Select a PDF and generate clear,
                        structured AI study notes.
                    </p>

                </div>


                {/* File Upload Area */}

                <label
                    className={
                        `upload-drop-zone ${
                            loading
                                ? "upload-zone-disabled"
                                : ""
                        }`
                    }
                >

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        disabled={loading}
                        hidden
                    />

                    <div className="upload-drop-icon">
                        📤
                    </div>


                    {file ? (

                        <>
                            <p className="selected-file-name">
                                {file.name}
                            </p>

                            <p className="upload-helper-text">
                                Click here to choose another PDF.
                            </p>
                        </>

                    ) : (

                        <>
                            <p className="upload-main-text">
                                Click to choose a PDF
                            </p>

                            <p className="upload-helper-text">
                                PDF files only
                            </p>
                        </>

                    )}

                </label>


                {/* Error Message */}

                {error && (

                    <div
                        className="alert alert-danger mt-3 mb-0"
                        role="alert"
                    >
                        <strong>Generation failed.</strong>{" "}
                        {error}
                    </div>

                )}


                {/* Success Message */}

                {success && (

                    <div
                        className="alert alert-success mt-3 mb-0"
                        role="status"
                    >
                        <strong>Success!</strong>{" "}
                        {success}
                    </div>

                )}


                {/* Generate Button */}

                <div className="d-grid mt-4">

                    <button
                        type="button"
                        className="btn btn-primary btn-lg generate-button"
                        onClick={handleUpload}
                        disabled={loading || !file}
                    >

                        {loading
                            ? "Generating AI Notes..."
                            : "🤖 Generate AI Notes"
                        }

                    </button>

                </div>


                {/* Loading Panel */}

                {loading && (

                    <div
                        className="ai-loading-panel"
                        aria-live="polite"
                    >

                        <div
                            className="spinner-border text-primary ai-loading-spinner"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>


                        <div>

                            <h4 className="ai-loading-title">
                                🤖 Generating Your Study Notes
                            </h4>

                            <p className="ai-loading-message">
                                AI is reading your PDF,
                                understanding the concepts,
                                and preparing structured notes.
                            </p>

                            <p className="ai-loading-helper">
                                This may take a few moments.
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default UploadCard;