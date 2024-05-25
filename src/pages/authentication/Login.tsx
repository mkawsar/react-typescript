import type { FC } from 'react';
import LoginJWt from '../../components/authentication/login';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';

const Login: FC = () => {
    return(
        <Box sx={{ backgroundColor: 'background.default', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
           <Container maxWidth="sm" sx={{ py: '80px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                    <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', p: 4, }}>
                            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <div>
                                    <Typography color='textPrimary' gutterBottom variant='h4'>Log in</Typography>
                                    <Typography color='textSecondary' variant='body2'>Log in on the internal platform</Typography>
                                </div>
                            </Box>
                            <Box>
                                <LoginJWt />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
           </Container>
        </Box>
    );
};

export default Login;