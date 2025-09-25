import { beforeEach, describe, expect, test, vi } from "vitest";
import SearchPage from "./SearchPage";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { searchHeroesAction } from "@/heroes/actions/search-heroes.action";

import type { Hero } from "@/heroes/types/hero.interface";

vi.mock('./ui/SearchControls');

vi.mock("@/heroes/actions/search-heroes.action");

const mockSearchHeroAction = vi.mocked(searchHeroesAction);

const queryClient = new QueryClient();

vi.mock('@/components/custom/CustomJumbotron', ()=>({
    CustomJumbotron: () => <div data-testid="custom-jumbotron"></div>

}));

vi.mock('@/heroes/components/HeroGrid', ()=>({
    HeroGrid: ({heroes}:{heroes:Hero[]})=>(<div data-testid="hero-grid">
        {
            heroes.map((hero)=>(<div key={hero.id} data-testid="hero-grid-item">{hero.name}</div>))
        }
    </div>)
}));

const renderSearchPage = (initialEntries:string[] = ["/"]) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <FavoriteHeroProvider>
                <QueryClientProvider client={queryClient}>
                        <SearchPage />
                </QueryClientProvider>
            </FavoriteHeroProvider>
        </MemoryRouter>
    )
}

describe('SearchPage', () => {
    beforeEach(()=>{
        vi.clearAllMocks();
    });

    test('should render searchPage with default values', () => { 
        
        const {container} =renderSearchPage();

        // screen.debug();
        expect(container).toMatchSnapshot();
        expect(mockSearchHeroAction).toHaveBeenCalledWith({name: "", strength: "0"});
    });
    test('should call search action with name parameter', () => { 
        const {container} =renderSearchPage(['/search?name=superman']);

        // screen.debug();
        expect(container).toMatchSnapshot();
        expect(mockSearchHeroAction).toHaveBeenCalledWith({name: "superman", strength: "0"});
    });
    test('should call search action with strength parameter', () => { 
        const {container} =renderSearchPage(['/search?strength=6']);

        // screen.debug();
        expect(container).toMatchSnapshot();
        expect(mockSearchHeroAction).toHaveBeenCalledWith({name: "", strength: "6"});
    });
    test('should call search action with strength and name parameter', () => { 
        const {container} =renderSearchPage(['/search?strength=8&name=batman']);

        // screen.debug();
        expect(container).toMatchSnapshot();
        expect(mockSearchHeroAction).toHaveBeenCalledWith({name: "batman", strength: "8"});
    });
    test('should render herogrid with search results', async () => { 
        const mockHeroes = [
            {id:"1", name: 'Clark Kent'} as unknown as Hero,
            {id:"2", name: 'Bruce Wayne'} as unknown as Hero,
        ];
        
        mockSearchHeroAction.mockResolvedValue(mockHeroes);

        renderSearchPage();

        await waitFor(()=>{
            expect(screen.getByText("Clark Kent")).toBeDefined();
            expect(screen.getByText("Bruce Wayne")).toBeDefined();
        });

        screen.debug(screen.getByTestId('hero-grid'));
    });
   
});