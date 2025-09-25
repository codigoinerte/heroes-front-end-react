import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { CustomPagination } from "./CustomPagination";
import { MemoryRouter } from "react-router";

import type { PropsWithChildren } from 'react';


vi.mock("../ui/button", ()=>({
    Button: ({children, ...props}:PropsWithChildren) => (<button {...props}>{children}</button>)
}));

const renderWithRouter = (
        Component: React.ReactElement, 
        initialEntries?: string[]
    ) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
           {Component}
        </MemoryRouter>
    )
}

describe('CustomPagination', () => {
    test('should render component with default values', () => { 
        // render(<CustomPagination totalPages={5} />)

        renderWithRouter(<CustomPagination totalPages={5} />);

        // screen.debug();

        expect(screen.getByText('Anterior')).toBeDefined();
        expect(screen.getByText('Siguiente')).toBeDefined();
    });
    test('should disabled previus button when page is 1', () => { 
        renderWithRouter(<CustomPagination totalPages={5} />)

        const previusButton = screen.getByText('Anterior');
        expect(previusButton.getAttributeNames()).toContain('disabled');
    });
    test('should disabled next button when we are in the last page', () => { 
        renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=5']);

        const nextButton = screen.getByText('Siguiente');
        // screen.debug(nextButton);
        expect(nextButton.getAttributeNames()).toContain('disabled');
    });
    test('should disabled button 3 when we are in page 3', () => { 
        renderWithRouter(<CustomPagination totalPages={10} />, ['/?page=3']);

        const page3 = screen.getByText('3');
        const page2 = screen.getByText('2');
        // screen.debug(page2);
        // screen.debug(page3);
        // expect(nextButton.getAttributeNames()).toContain('disabled');
        expect(page2.getAttribute('variant')).toBe('outline');
        expect(page3.getAttribute('variant')).toBe('default');
    });
    test('should change page when click on number button', () => { 
        
        renderWithRouter(<CustomPagination totalPages={10} />, ['/?page=3']);

        const page2 = screen.getByText('2');
        const page3 = screen.getByText('3');

        expect(page2.getAttribute('variant')).toBe('outline');
        expect(page3.getAttribute('variant')).toBe('default');
        
        fireEvent.click(page2);
        
        // screen.debug();
        
        expect(page2.getAttribute('variant')).toBe('default');
        expect(page3.getAttribute('variant')).toBe('outline');

    });
});