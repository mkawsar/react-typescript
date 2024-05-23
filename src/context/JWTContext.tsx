import PropTypes from 'prop-types';
import { authApi } from '../APIs/authApi';
import type { IUser } from '../types/user';
import type { FC, ReactNode } from 'react';
import { createContext, useEffect, useReducer } from 'react';

interface IState {
    isInitialized: boolean,
    isAuthenticated: boolean,
    user: IUser | null
};

interface AuthContextValue extends IState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

interface AuthProviderProps {
    children: ReactNode
};

type InitializeAction = {
    type: 'INITIALIZE';
    payload: {
        isAuthenticated: boolean;
        user: IUser | null;
    };
};

type LoginAction = {
    type: 'LOGIN',
    payload: {
        user: IUser;
    };
};

type LogoutAction = {
    type: 'LOGOUT',
};

type Action = InitializeAction | LoginAction | LogoutAction;

const initialState: IState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers: Record<string, (state: IState, action: Action) => IState> = {
    INITIALIZE: (state: IState, action: InitializeAction | any): IState => {
        const { isAuthenticated, user } = action.payload;
        return  {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },

    LOGIN: (state: IState, action: LoginAction | any): IState => {
        const {user} = action.payload;
        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },

    LOGOUT: (state: IState): IState => ({
        ...state,
        isAuthenticated: false,
        user: null
    }),
};

const reducer = (state: IState, action: Action): IState =>
    handlers[action.type] ? handlers[action.type](state, action): state;

const AuthContext = createContext<AuthContextValue>({
    ...initialState,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const initialze = async (): Promise<void> => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                if (accessToken) {
                    const user = await authApi.me(accessToken);
                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: true,
                            user
                        }
                    });
                } else {
                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: false,
                            user: null
                        }
                    })
                }
            } catch (err) {
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null
                    }
                })
            }
        };
        initialze();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const accessToken = await authApi.login(email, password);
        const user = await authApi.me(accessToken);
        console.log(email, password);
        localStorage.setItem('accessToken', accessToken);
        dispatch({
            type: 'LOGIN',
            payload: {
                user
            }
        })
    };

    const logout = async (): Promise<void> => {
        localStorage.removeItem('accessToken');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{...state, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthContext;
