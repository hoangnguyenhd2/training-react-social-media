import { 
    type UseFormReturn, 
    type ControllerProps,
    FormProvider, 
    Controller, 
    useController, 
    useFormContext 
} from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Checkbox } from "@/components/ui/checkbox";
import { capitalize } from "@/utils/global";
import { cn } from "@/lib/utils";

export function Form ({ children, onSubmit, ...form }: {
    children: React.ReactNode
    onSubmit: (data: any) => void
} & UseFormReturn<any>) {
    return (
        <FormProvider {...form}>
            <form 
                className="space-y-3.5" 
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {children}
            </form>
        </FormProvider>
    )
}

export function FormInput ({ name, label, description, ...props }: {
    name: string
    label?: string
    description?: string
} & React.ComponentPropsWithoutRef<"input">) {
    const { control }           = useFormContext();
    const { field, fieldState } = useController({
        name,
        control
    });
    return (
        <FormItem state={fieldState}>
            {<FormLabel htmlFor={name}>{label ?? capitalize(name)}</FormLabel>}
            <Input 
                id={name} 
                {...field} 
                {...props} 
            />
            {description && (<FormDescription>{description}</FormDescription>)}
        </FormItem>
    )
}

export function FormDescription ({ className, children }: {
    className?: string
    children: React.ReactNode
}) {
    return (
        <p className={cn('text-slate-500/95 text-sm', className)}>{children}</p>
    )
}

export function FormTextarea ({ name, label, ...props }: {
    name: string
    label?: string
} & React.ComponentPropsWithoutRef<"textarea">) {
    const { control }           = useFormContext();
    const { field, fieldState } = useController({
        name,
        control
    });
    return (
        <FormItem state={fieldState}>
            {<FormLabel htmlFor={name}>{label ?? capitalize(name)}</FormLabel>}
            <Textarea 
                id={name} 
                {...field} 
                {...props} 
            />
        </FormItem>
    )
}

export function FormSelect ({ name, label, options = {}, ...props }: {
    name: string
    label?: string
    options: { [key: string]: string }
    [key: string]: any
}) {
    const { control }           = useFormContext();
    const { field, fieldState } = useController({
        name,
        control
    });
    return (
        <FormItem state={fieldState}>
            {<FormLabel htmlFor={name}>{label ?? capitalize(name)}</FormLabel>}
            <NativeSelect 
                id={name} 
                {...field} 
                {...props}
            >
                <NativeSelectOption>Please select</NativeSelectOption>
                {Object.entries(options).map(([value, text]) => (
                    <NativeSelectOption key={value} value={value}>{text}</NativeSelectOption>
                ))}
            </NativeSelect>
        </FormItem>
    )
}

export function FormCheckbox ({ name, label }: {
    name: string
    label?: string
}) {
    const { control }           = useFormContext();
    const { field, fieldState } = useController({
        name,
        control
    });
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
    )
}

export function FormLabel ({ className, ...props }: React.ComponentPropsWithoutRef<"label">) {
    return (
        <label 
            className={cn('text-sm font-medium block', className)} 
            {...props} 
        />
    )
}

export function FormMessage ({ children }: {
    children: React.ReactNode
}) {
    return (
        <p className="text-red-500 text-sm">{children}</p>
    )
}

export function FormItem ({ children, state }: {
    children: React.ReactNode;
    state?: {
        error?: {
            message?: string
        }
    }
}) {
    return (
        <div className="space-y-2">
            {children}
            {state?.error && <FormMessage>{state.error.message}</FormMessage>}
        </div>
    )
}

export function FormField (props: ControllerProps) {
    const { control } = useFormContext();
    return (
        <Controller 
            control={control} 
            {...props} 
        />
    )
}