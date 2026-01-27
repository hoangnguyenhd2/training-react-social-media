/* components */
import { AuthContainer } from "@/components/Container";
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Form, FormInput } from '@/components/Form';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
/* form */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
/* hooks */
import { useAuth } from '@/hooks/useAuth';
/* types */
import { type LoginResponse } from '@/types/api';
import { useLoader } from "@/hooks/useLoader";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const loginFormSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(5)
});

type loginFormType = z.infer<typeof loginFormSchema>;

const Login = () => {
    const navigate       = useNavigate();
    const { setLoading } = useLoader();
    const { login }      = useAuth();
    const form           = useForm<loginFormType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: 'hoangnguyenhd2',
            password: 'hoangnguyenhd2'
        }
    });

    const submit = async ( data: loginFormType ) => {
        try {
            setLoading(true);
            await login<LoginResponse>(data);
            toast.success('Login successfully');
            navigate(ROUTES.INDEX);
        } catch ( err: any ) {
            toast.error(err.message || 'Unknow error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContainer>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form 
                        {...form}
                        onSubmit={submit}
                    >
                        <FormInput 
                            name="username" 
                            description="Demo: hoangnguyenhd2"
                        />
                        <FormInput 
                            name="password" 
                            type="password" 
                            description="Demo: hoangnguyenhd2"
                        />
                        <Button className="w-full">Submit</Button>
                    </Form>
                </CardContent>
            </Card>
        </AuthContainer>
    )
}

export default Login;