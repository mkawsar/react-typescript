import type {FC} from 'react';
import {Alert, Box, Button, FormHelperText, TextField} from '@mui/material';
import useAuth from '../../hooks/useAuth';
import useMounted from '../../hooks/useMounted';
import * as Yup from 'yup';
import {Formik} from 'formik';

const LoginJWT: FC = (props) => {
    const mounted = useMounted();
    const {login} = useAuth() as any;

    return (
        <Formik
            initialValues={{
                email: 'admin@example.com',
                password: 'password',
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={async (values, {setErrors, setStatus, setSubmitting}): Promise<void> => {
                try {
                    await login(values.email, values.password);
                    if (mounted.current) {
                        setStatus({success: true});
                        setSubmitting(false);
                    }
                } catch (err: any) {
                    if (mounted.current) {
                        setStatus({success: false});
                        setErrors({submit: err?.message});
                        setSubmitting(false);
                    }
                }
            }}
        >
            {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values,}): JSX.Element => (
                <form noValidate onSubmit={handleSubmit} {...props}>
                    <TextField
                        autoFocus
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label='Email Address'
                        margin='normal'
                        name='email'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type='email'
                        value={values.email}
                        variant='outlined'
                    />
                    <TextField
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        label='Password'
                        margin='normal'
                        name='password'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type='password'
                        value={values.password}
                        variant='outlined'
                    />
                    {errors.submit && (
                        <Box sx={{mt: 3}}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}
                    <Box sx={{mt: 2}}>
                        <Button
                            color='primary'
                            disabled={isSubmitting}
                            fullWidth
                            size='large'
                            type='submit'
                            variant='contained'
                        >
                            Log In
                        </Button>
                    </Box>
                    <Box sx={{mt: 2}}>
                        <Alert severity='info'>
                            <div>
                                User <b>admin@example.com </b> and Password <b>password</b>
                            </div>
                        </Alert>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default LoginJWT;