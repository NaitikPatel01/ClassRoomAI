import { Logo } from "@/components/icons";

type AuthLayoutProps = {
    title: string;
    description: string;
    children: React.ReactNode;
};

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm">
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-4 flex items-center gap-2 text-foreground">
                        <Logo className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">ClassroomAI</h1>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
                {children}
            </div>
        </div>
    );
}
