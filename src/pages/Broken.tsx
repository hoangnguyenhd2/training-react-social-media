import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

const Broken = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-6xl font-bold text-zinc-200 dark:text-zinc-800">404</h1>
            <p className="mt-4 text-zinc-500">Page not found</p>
            <Button asChild className="mt-6">
                <Link to={ROUTES.INDEX}>Go Home</Link>
            </Button>
        </div>
    );
}

export default Broken;
