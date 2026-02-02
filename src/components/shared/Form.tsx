import { 
    type UseFormReturn, 
    type ControllerProps,
    type FieldValues,
    FormProvider, 
    Controller, 
    useController, 
    useFormContext 
} from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// ============================================
// Form wrapper
// ============================================
interface FormProps<T extends FieldValues> extends UseFormReturn<T> {
    children: React.ReactNode;
    onSubmit: (data: T) => void | Promise<void>;
    className?: string;
}

export function Form<T extends FieldValues>({ 
    children, 
    onSubmit, 
    className,
    ...form 
}: FormProps<T>) {
    return (
        <FormProvider {...form}>
            <form 
                className={cn("space-y-3.5", className)} 
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {children}
            </form>
        </FormProvider>
    );
}

// ============================================
// Form fields
// ============================================
interface BaseFieldProps {
    name: string;
    label?: string;
    description?: string;
}

export function FormInput({ 
    name, 
    label, 
    description, 
    ...props 
}: BaseFieldProps & React.ComponentPropsWithoutRef<"input">) {
    const { control } = useFormContext();
    const { field, fieldState } = useController({ name, control });

    return (
        <FormItem state={fieldState}>
            {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
            <Input id={name} {...field} {...props} />
            {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
    );
}

export function FormTextarea({ 
    name, 
    label, 
    ...props 
}: BaseFieldProps & React.ComponentPropsWithoutRef<"textarea">) {
    const { control } = useFormContext();
    const { field, fieldState } = useController({ name, control });

    return (
        <FormItem state={fieldState}>
            {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
            <Textarea id={name} {...field} {...props} />
        </FormItem>
    );
}

interface FormSelectProps extends BaseFieldProps {
    options: Record<string, string>;
    placeholder?: string;
}

export function FormSelect({ 
    name, 
    label, 
    options = {},
    placeholder = "Select..." 
}: FormSelectProps) {
    const { control } = useFormContext();
    const { field, fieldState } = useController({ name, control });

    return (
        <FormItem state={fieldState}>
            {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
            <NativeSelect id={name} {...field}>
                <NativeSelectOption value="">{placeholder}</NativeSelectOption>
                {Object.entries(options).map(([value, text]) => (
                    <NativeSelectOption key={value} value={value}>
                        {text}
                    </NativeSelectOption>
                ))}
            </NativeSelect>
        </FormItem>
    );
}

export function FormCheckbox({ name, label }: BaseFieldProps) {
    const { control } = useFormContext();
    const { field, fieldState } = useController({ name, control });

    return (
        <FormItem state={fieldState}>
            <FormLabel>
                <div className="flex items-center gap-2">
                    <Checkbox 
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    <span>{label}</span>
                </div>
            </FormLabel>
        </FormItem>
    );
}

// ============================================
// Form primitives
// ============================================
export function FormLabel({ 
    className, 
    ...props 
}: React.ComponentPropsWithoutRef<"label">) {
    return (
        <label 
            className={cn('text-sm font-medium block', className)} 
            {...props} 
        />
    );
}

export function FormDescription({ 
    className, 
    children 
}: { className?: string; children: React.ReactNode }) {
    return (
        <p className={cn('text-zinc-500 text-sm', className)}>
            {children}
        </p>
    );
}

export function FormMessage({ children }: { children: React.ReactNode }) {
    return <p className="text-red-500 text-sm">{children}</p>;
}

interface FormItemProps {
    children: React.ReactNode;
    state?: { error?: { message?: string } };
}

export function FormItem({ children, state }: FormItemProps) {
    return (
        <div className="space-y-2">
            {children}
            {state?.error && <FormMessage>{state.error.message}</FormMessage>}
        </div>
    );
}

export function FormField(props: ControllerProps) {
    const { control } = useFormContext();
    return <Controller control={control} {...props} />;
}
