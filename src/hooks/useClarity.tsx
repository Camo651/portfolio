import Clarity from '@microsoft/clarity';
import { useEffect } from 'react';

export const useClarity = () => {
    const projectId = process.env.CLARITY_PROJECT_ID;
    if (!projectId) {
        console.error('Clarity project ID is not defined');
        return;
    }
    if (!projectId) {
        console.error('Clarity project ID is not defined');
        return;
    }

    Clarity.init(projectId);

    let userId = localStorage.getItem('clarity-userId');
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('clarity-userId', userId);
    }
    let sessionId = sessionStorage.getItem('clarity-sessionId');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('clarity-sessionId', sessionId);
    }
    const pageId = window.location.pathname;
    const friendlyName = document.title;
    Clarity.identify(userId, sessionId, pageId, friendlyName);
};
