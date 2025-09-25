import { describe, expect, test } from "vitest";
import { getHero } from "./get-hero.action";

const BASE_URL = import.meta.env.VITE_API_URL;

describe('getHeroAction', ()=> {
    test('should fetch hero data and return with complete image url', async() => { 
                
        const data = await getHero('clark-kent');
        
        expect(data.alias).toBe('Superman');
        expect(data.image).toContain(BASE_URL);

    });
    test('should throw and error if hero is not found', async () => { 
        const id = 'clark-kent2';
        const result = await getHero(id)
        .catch((error) => {
            const message = error.response.data.message ?? '';
            expect(error).toBeDefined();
            expect(message).toBe('Hero not found');
        });
        
        expect(result).toBeUndefined();
    });
});