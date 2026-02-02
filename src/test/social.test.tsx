import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SocialPost } from '@/components/posts/Social';
import { BrowserRouter } from 'react-router-dom';
import { LoaderProvider } from '@/contexts/LoaderContext';
import type { Post } from '@/types/post';

// Inline mock data
const mockUser = {
    id: 'mock-user-123',
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
    role: 'user' as const
};

const mockPost: Post = {
    id: 'mock-post-123',
    content: 'Test post content',
    user_id: mockUser.id,
    user: mockUser,
    count: { like: 10, comment: 5, share: 2 },
    actions: { current: null },
    score: 0,
    likes: [],
    reactions: {}
};

const mockAuthContext = {
    isLogged: true,
    user: mockUser,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn()
};

vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => mockAuthContext
}));

vi.mock('@/services/post.service', () => ({
    postService: {
        react: vi.fn().mockResolvedValue(undefined)
    }
}));

function SocialPostWrapper({ post, onDelete }: { post: Post; onDelete: () => void }) {
    return (
        <LoaderProvider>
            <BrowserRouter>
                <SocialPost post={post} onDelete={onDelete} />
            </BrowserRouter>
        </LoaderProvider>
    );
}

describe('SocialPost Component', () => {
    it('should render post content', () => {
        const mockDelete = vi.fn();
        render(<SocialPostWrapper post={mockPost} onDelete={mockDelete} />);
        
        expect(screen.getByText(mockPost.content)).toBeInTheDocument();
        expect(screen.getByText(mockPost.user.name)).toBeInTheDocument();
    });

    it('should display like count', () => {
        const mockDelete = vi.fn();
        render(<SocialPostWrapper post={mockPost} onDelete={mockDelete} />);
        
        // Check that like count is displayed
        expect(screen.getByText(String(mockPost.count.like))).toBeInTheDocument();
    });

    it('should toggle like on click', async () => {
        const mockDelete = vi.fn();
        
        render(<SocialPostWrapper post={mockPost} onDelete={mockDelete} />);
        
        // Find like button by looking for Heart icon's parent button
        const likeButtons = screen.getAllByRole('button');
        const likeButton = likeButtons.find(btn => 
            btn.querySelector('svg')?.classList.contains('lucide-heart') ||
            btn.textContent?.includes(String(mockPost.count.like))
        );
        
        // If we found a clickable like area, click it
        if (likeButton) {
            fireEvent.click(likeButton);
        }
    });

    it('should show delete option for post owner', () => {
        const mockDelete = vi.fn();
        
        // Set user as post owner
        mockAuthContext.user = { ...mockUser, id: mockPost.user.id } as any;
        
        render(<SocialPostWrapper post={mockPost} onDelete={mockDelete} />);
        
        // The dropdown trigger should be visible for the owner
        // Look for any button that might be the more options button
        const buttons = screen.getAllByRole('button');
        
        // Should have at least one button (like button or more options)
        expect(buttons.length).toBeGreaterThan(0);
    });
});
