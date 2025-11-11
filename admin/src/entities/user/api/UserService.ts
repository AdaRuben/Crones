import axios from "axios";
import { authResponseSchema } from "../model/schema";
import type { loginUser, newUser, User } from "../model/type";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class UserService {
    static async registerUser(user: newUser): Promise<{admin: Omit<User, 'password'>}> {
        try {
            const res = await axios.post('/api/auth/signup', user);
            
            return authResponseSchema.parse(res.data);
        } catch (error) {
            if (error instanceof Error) {
            console.log(error.message); 
        }
        throw error;
    }}

    static async refresh(): Promise<{admin: Omit<User, 'password'>, accessToken: string}> {
        try {
            const res = await axios.get('/api/auth/refresh');
            return authResponseSchema.parse(res.data);
        } catch (error) {
            if (error instanceof Error) {
            console.log(error.message); 
        }
        throw error;
    }}

    static async loginUser(user: loginUser): Promise<loginUser> {
        try {
            const res = await axios.post('/api/auth/signin', user);
            return authResponseSchema.parse(res.data);
        } catch (error) {
            if (error instanceof Error) {
            console.log(error.message); 
        }
        throw error;
    }}

    static async logout(): Promise<void> {
        try {
            await axios.delete('/api/auth/signout');
        } catch (error) {
            if (error instanceof Error) {
            console.log(error.message); 
        }
        throw error;
    }}
}

export default UserService;