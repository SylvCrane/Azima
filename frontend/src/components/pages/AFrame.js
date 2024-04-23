import React, { useEffect } from "react";


export const AFrame = () => {
   
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

    return (
        <div className="editor-page" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <iframe src={`${process.env.PUBLIC_URL}/azima.html`} title="Azima" style={{
                border: 'none',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }}></iframe>
        </div>
    );
};