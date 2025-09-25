import { describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from '@testing-library/react';
import { useHeroSummary } from "./useHeroSummary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { getSummaryAction } from "../actions/get-summary.actions";
import type { SummaryInformationResponse } from "../types/summary-information.response";


vi.mock("../actions/get-summary.actions", ()=>({
    getSummaryAction: vi.fn()
}));

const mockGetSummaryAction = vi.mocked(getSummaryAction);

const tanStackCustomProvider = () => {
    const queryClient = new QueryClient({
        defaultOptions:{
            queries: {
                retry: false
            }
        }
    });

    return ({children}:PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('useHeroSummary', () => {
    test('should return the initial state (isLoading)', () => { 
        
        const { result } = renderHook(()=> useHeroSummary(),{
            wrapper: tanStackCustomProvider()
        });

        
        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBeFalsy();
        expect(result.current.data).toBeUndefined();

    });

    test('should return success state with data when API call success', async () => { 


        const mockGetSummaryData = {
            totalHeroes:10,
            strongestHero: {
                id:'1',
                name: 'Superman'
            },
            smartestHero: {
                id:'1',
                name: 'Batman'
            },
            heroCount: 18,
            villainCount: 7
        } as SummaryInformationResponse;

        mockGetSummaryAction.mockResolvedValue(mockGetSummaryData);
               
        const { result } = renderHook(()=> useHeroSummary(),{
            wrapper: tanStackCustomProvider()
        });

        await waitFor(()=> {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.isError).toBe(false);
        expect(mockGetSummaryAction).toHaveBeenCalled();

    });

    test('should return error state when API call fails', async () => { 
        const mockError = new Error('Failed to fetch summary');

        mockGetSummaryAction.mockRejectedValue(mockError);

        const { result } = renderHook(()=> useHeroSummary(),{
            wrapper: tanStackCustomProvider()
        });

        await waitFor(()=> {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.isLoading).toBeFalsy();
        expect(mockGetSummaryAction).toHaveBeenCalled();
        // expect(mockGetSummaryAction).toHaveBeenCalledTimes(1);
        expect(result.current.error?.message).toBe('Failed to fetch summary');

    });
})