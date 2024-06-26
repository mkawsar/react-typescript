import type {FC} from 'react';
import useAuth from '../../hooks/useAuth';
import {Box, Button, Card, Container, CardContent} from '@mui/material';

const Home: FC = (props) => {

    const {logout} = useAuth() as any;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err: any) {
            console.log(err);
        }
    }

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Container maxWidth='sm' sx={{py: '80px'}}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 8,
                    }}
                ></Box>
                <Card>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            p: 4,
                        }}
                    >
                        <p>Hello world</p>
                        <Box sx={{mt: 2}}>
                            <Button onClick={handleLogout}
                                color='primary'
                                fullWidth
                                size='large'
                                type='submit'
                                variant='contained'
                            >
                                Logout
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    )
}

export default Home;
