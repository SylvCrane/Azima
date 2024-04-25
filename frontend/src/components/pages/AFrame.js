import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const AFrame = () => {
    const location = useLocation();

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.data.action === 'navigate') {
                window.location.href = event.data.path; // Use window.location for navigation
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    // Determine the content based on the path
    const iframeSrc = location.pathname.includes("/editor/aframe") ?
        `${process.env.PUBLIC_URL}/editor.html` :
        `${process.env.PUBLIC_URL}/viewer.html`;

    return (
        <div className="editor-page" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <iframe src={iframeSrc} title="Azima" style={{
                border: 'none',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }}></iframe>
        </div>
    );
};