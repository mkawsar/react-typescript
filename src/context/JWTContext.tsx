import {createContext, useEffect, useReducer} from 'react';
import type {FC, ReactNode} from 'react';
import PropTypes from 'prop-types';
import type {User} from '../types/user';
import {authApi} from '../APIs/authApi';

interface State {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: User | null;
}

interface AuthContextValue extends State {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, name: string, password: string) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

type InitializeAction = {
    type: 'INITIALIZE';
    payload: {
        isAuthenticated: boolean;
        user: User | null;
    };
};

type LoginAction = {
    type: 'LOGIN';
    payload: {
        user: User;
    };
};

type LogoutAction = {
    type: 'LOGOUT';
};

type RegisterAction = {
    type: 'REGISTER';
    payload: {
        user: User;
    };
};

type Action = InitializeAction | LoginAction | LogoutAction | RegisterAction;

const initialState: State = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers: Record<string, (state: State, action: Action) => State> = {
    INITIALIZE: (state: State, action: InitializeAction | any): State => {
        const {isAuthenticated, user} = action.payload;

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    LOGIN: (state: State, action: LoginAction | any): State => {
        const {user} = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state: State): State => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state: State, action: RegisterAction | any): State => {
        const {user} = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
};

const reducer = (state: State, action: Action): State =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
    ...initialState,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
    const {children} = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const initialize = async (): Promise<void> => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');

                if (accessToken) {
                    const user = await authApi.me(accessToken);

                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    });
                } else {
                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialize();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const accessToken = await authApi.login(email, password);
        const user = await authApi.me(accessToken);
        localStorage.setItem('accessToken', accessToken);

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        });
    };

    const logout = async (): Promise<void> => {
        localStorage.removeItem('accessToken');
        dispatch({type: 'LOGOUT'});
    };

    const register = async (
        email: string,
        name: string,
        password: string
    ): Promise<void> => {
        const accessToken = await authApi.register(email, name, password);
        const user = await authApi.me(accessToken);

        localStorage.setItem('accessToken', accessToken);

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
