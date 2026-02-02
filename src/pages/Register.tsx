import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormInput } from '@/components/shared/Form';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { ROUTES } from "@/constants/routes";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { useLoader } from "@/hooks/useLoader";

const schema = z.object({
    name: z.string().min(2, "Min 2 characters"),
    username: z.string().min(3, "Min 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Min 6 characters")
});

type FormData = z.infer<typeof schema>;

const Register = () => {
    const navigate = useNavigate();
    const { setLoading } = useLoader();
    const { register } = useAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', username: '', email: '', password: '' }
    });

    const submit = async (data: FormData) => {
        try {
            setLoading(true);
            await register(data);
            toast.success('Account created!');
            navigate(ROUTES.INDEX);
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl">Create account</CardTitle>
                    <CardDescription>Get started with SocialApp</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} onSubmit={submit}>
                        <FormInput name="name" placeholder="Full Name" />
                        <FormInput name="username" placeholder="Username" />
                        <FormInput name="email" type="email" placeholder="Email" />
                        <FormInput name="password" type="password" placeholder="Password" />
                        <Button className="w-full" size="lg">Create Account</Button>
                    </Form>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="text-blue-500 hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default Register;
