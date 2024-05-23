import wait from '../utils/wait';
import { IUser } from '../types/user';
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from '../utils/jwt';

const users = [
    {
        id: '5e86809283e28b96d2d38537',
        email: 'demo@demo.com',
        name: 'Demo',
        password: 'password123',
        plan: 'premium',
    }
];

class AuthApi {
    async login(email: string, password: string): Promise<string> {
        await wait(500);
        return new Promise((resolve, reject) => {
            try {
                const user = users.find((_user) => _user.email === email);
                if (!user || user.password !== password) {
                    reject(new Error('Please check your email and password'));
                    return;
                }

                // Create the access token
                const accessToken = sign({ userId: user.id }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
          
                resolve(accessToken);
            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        })
    }
    me(accessToken: string): Promise<IUser> {
        return new Promise((resolve, reject) => {
            try {
            // Decode access token
            const { userId } = decode(accessToken) as any;

            // Find the user
            const user = users.find((_user) => _user.id === userId);

            if (!user) {
                reject(new Error('Invalid authorization token'));
                return;
            }

            resolve({
                id: user.id,
                email: user.email,
                name: user.name,
                plan: user.plan,
            });
            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }
}

export const authApi = new AuthApi();
