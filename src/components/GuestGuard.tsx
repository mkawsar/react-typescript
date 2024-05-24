import PropType from 'prop-types';
import useAuth from '../hooks/useAuth';
import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface GuestGuardProps {
    children: ReactNode;
};

const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to='/' />;
    }

    return <>{children}</>
};

GuestGuard.propTypes = {
    children: PropType.node,
};

export default GuestGuard;
