import { useState } from "react";

import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";
import SummaryCard from "../components/SummaryCard";

import "../styles/Dashboard.css";


function Dashboard() {

    const [notes, setNotes] = useState(null);
    const [noteId, setNoteId] = useState(null);


    const handleSummaryGenerated = (generatedData) => {

        if (!generatedData) {
            setNotes(null);
            setNoteId(null);
            return;
        }

        console.log("GENERATED DATA RECEIVED:", generatedData);

        setNotes(generatedData.notes);

        setNoteId(generatedData.noteId);
    };


    return (
        <div className="dashboard-page">

            <Navbar />

            <main className="dashboard-container">

                <header className="dashboard-header">

                    <h1 className="dashboard-title">
                        👋 Welcome to AI Notes
                    </h1>

                    <p className="dashboard-subtitle">
                        Upload your study material and generate clear,
                        structured notes for faster learning and revision.
                    </p>

                </header>


                <section>

                    <UploadCard
                        onSummaryGenerated={handleSummaryGenerated}
                    />

                </section>


                {notes && (

                    <section className="notes-section">

                        <SummaryCard
                            notes={notes}
                            noteId={noteId}
                        />

                    </section>

                )}

            </main>

        </div>
    );
}


export default Dashboard;