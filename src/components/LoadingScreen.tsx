import { useEffect } from 'react';
import type { FC } from 'react';
import nProgress from 'nprogress';
import { Box } from '@mui/material'

const LoadingScreen: FC = () => {
    useEffect(() => {
        nProgress.start();

        return (): void => {
            nProgress.done();
        };
    }, []);

    return (
        <Box
            sx={{
                backgroundColor: 'background.paper',
                minHeight: '100%',
            }}
        />
    );
};

export default LoadingScreen;
