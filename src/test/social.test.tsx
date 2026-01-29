import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SocialPost } from '@/components/Social';
import { BrowserRouter } from 'react-router-dom';
import { LoaderProvider } from '@/contexts/LoaderContext';
import mockUser from '@/mocks/user.json';
import type { Post } from '@/types/post';

const mockPost: Post = {
    id: '1',
    content: 'Test post content',
    user: mockUser,
    count: {
        like: 10,
        comment: 5,
        share: 2
    },
    actions: {
        liked: false
    }
};

const mockAuthContext = {
    isLogged: true,
    user: mockUser,
    login: vi.fn(),
    logout: vi.fn()
};

vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => mockAuthContext
}));

function SocialPostWrapper ({ post, onDelete }: { post: Post, onDelete: () => void }) {
    return (
        <LoaderProvider>
            <BrowserRouter>
                <SocialPost post={post} onDelete={onDelete} />
            </BrowserRouter>
        </LoaderProvider>
    );
}

describe('Test SocialPost Component', () => {
    it('should render post content', () => {
        const mockDelete = vi.fn();
        render(<SocialPostWrapper post={mockPost} onDelete={mockDelete} />);
        
        expect(screen.getByText(mockPost.content)).toBeInTheDocument();
        expect(screen.getByText(mockPost.user.name)).toBeInTheDocument();
    });

    it('should display post metrics', () => {
        const mockDelete = vi.fn();
        render(<SocialPostWrapper post={mockPost} onDelete={mockDelete} />);
        
        expect(screen.getByText(/Like/i)).toBeInTheDocument();
        expect(screen.getByText(/Comment/i)).toBeInTheDocument();
        expect(screen.getByText(/Share/i)).toBeInTheDocument();
    });

    it('should like post on click when logged in', () => {
        const mockDelete = vi.fn();
        render(<SocialPostWrapper post={mockPost} onDelete={mockDelete} />);
        
        const likeButton = screen.getByText(/Like/i).parentElement;
        fireEvent.click(likeButton!);
    });
});
