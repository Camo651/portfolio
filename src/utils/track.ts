interface TrackerData {
    machineId: string;
    sessionId: string;
    action: string;
}

export const track = async (action: string) => {
    try {
        let machineId = localStorage.getItem('machineId');
        if (!machineId) {
            machineId = crypto.randomUUID();
            localStorage.setItem('machineId', machineId);
        }
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            sessionStorage.setItem('sessionId', sessionId);
        }
        const data: TrackerData = {
            machineId,
            sessionId,
            action,
        };
        await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-For': window.location.hostname,
                'User-Agent': navigator.userAgent,
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error tracking data:', error);
    }
};
