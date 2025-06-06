import React from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
    children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
    const portalRoot = document.getElementById('portal-root');
    if (!portalRoot) {
        console.error('No portal root found');
        return null;
    }

    return ReactDOM.createPortal(children, portalRoot);
};

export default Portal;
