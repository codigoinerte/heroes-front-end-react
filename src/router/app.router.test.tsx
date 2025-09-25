import { describe, expect, test, vi } from "vitest";
import { appRouter } from "./app.router";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider, useParams } from "react-router";

vi.mock('@/heroes/pages/home/HomePage', ()=>({
    HomePage: () => <div data-testid="homepage"></div>,
}));

vi.mock('@/heroes/layouts/HeroesLayout', ()=>({
    HeroesLayout: () => <div data-testid="heroeslayout">
        <Outlet />
    </div>,
}));

vi.mock('@/heroes/pages/hero/HeroPage', () => ({
    HeroPage: () => {
        const { idSlug = ''  } = useParams();
        return (
            <div data-testid="hero-page">
                HeroPage - {idSlug}
            </div>
        )
    }
}));

vi.mock('@/heroes/pages/search/SearchPage', ()=> ({
    default: () => <div data-testid="search"></div>
}));

describe('appRouter', ()=> {
    test('should be configured as expected', () => { 
    
        expect(appRouter.routes).toMatchSnapshot();

    });

    test('should render home page at root path', () => { 

        const router = createMemoryRouter(appRouter.routes, {
            initialEntries: ['/']
        });
        
        render(<RouterProvider router={router} />)
        
        // screen.debug();

        expect(screen.getByTestId('homepage')).toBeDefined();
    });

    test('should render hero page at /heroes/:idSlug path', () => { 
        const router = createMemoryRouter(appRouter.routes, {
            initialEntries: ['/heroes/superman']
        });

        render(<RouterProvider router={router} />)
        
        // screen.debug();

        expect(screen.getByTestId('hero-page').innerHTML).toContain('superman');
    });

    test('should render search page at /search patch', async () => { 

        const router = createMemoryRouter(appRouter.routes, {
            initialEntries: ['/search']
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByTestId('search')).toBeDefined();

        // screen.debug();

    });
    test('should redirect to home page for unknow routes', async () => { 

        const router = createMemoryRouter(appRouter.routes, {
            initialEntries: ['/otra-pagina-rara']
        });

        render(<RouterProvider router={router} />);
        
        // screen.debug();

        // expect(screen.findByTestId('homepage')).toBeDefined();
        expect(screen.getByTestId('homepage')).toBeDefined();

    });
});