import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormInput } from '@/components/shared/Form';

const loginSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(5)
});

type LoginFormType = z.infer<typeof loginSchema>;

function LoginFormComponent ({ onSubmit }: { onSubmit: (data: LoginFormType) => void }) {
    const form = useForm<LoginFormType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    return (
        <Form {...form} onSubmit={onSubmit}>
            <FormInput name="username" label="Username" />
            <FormInput name="password" label="Password" type="password" />
            <button type="submit">Submit</button>
        </Form>
    );
}

describe('Test Login Form', () => {
    it('should render login form with inputs', () => {
        const mockSubmit = vi.fn();
        render(<LoginFormComponent onSubmit={mockSubmit} />);
        
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should submit form with valid credentials', async () => {
        const mockSubmit = vi.fn();
        render(<LoginFormComponent onSubmit={mockSubmit} />);
        
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'hoangnguyenhd2' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'hoangnguyenhd2' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        
        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalled();
        });
    });

    it('should not submit form with short username', () => {
        const mockSubmit = vi.fn();
        render(<LoginFormComponent onSubmit={mockSubmit} />);
        
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'abc' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        
        expect(mockSubmit).not.toHaveBeenCalled();
    });
});
