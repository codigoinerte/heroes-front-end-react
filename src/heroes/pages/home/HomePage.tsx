import { use, useMemo } from "react"
import { useSearchParams } from "react-router";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "../search/ui/SearchControls"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext";

export const HomePage = () => {

  const { favoriteCount, favorites } = use(FavoriteHeroContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') ?? 'all';
  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '6';
  const category = searchParams.get('category') ?? 'all';

  const selectedTab = useMemo (() => {
    const validTabs = ["all" , "favorites" , "heroes" , "villains"];
    return validTabs.includes(activeTab) ? activeTab : 'all';
  }, [activeTab])

  
  
  const { data:heroesResponse } = usePaginatedHero(+page, +limit, category);

  const { data: summary } = useHeroSummary();

  return (
    <>
      <>
        <CustomJumbotron title="Universo de SuperHeroes" description="Descubre, explora y administra super heroes y villanos" />

        <CustomBreadcrumbs currentPage="Super Heroes"
        breadcrumbs={[
          // {label:'Home1', to: '/'},
          // {label:'Home2', to: '/'},
          // {label:'Home3', to: '/'},
        ]}/> 

        {/* Stats Dashboard */}
        <HeroStats />

        {/* Controls */}
        <SearchControls />

        {/* Tabs */}
        <Tabs value={selectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" onClick={()=> setSearchParams((prev) => {
              prev.set('tab', 'all');
              prev.set('category', 'all');
              prev.set('page', '1');
              return prev;
            } )}>
              All Characters ({summary?.totalHeroes})
            </TabsTrigger>
            <TabsTrigger value="favorites" onClick={()=> setSearchParams((prev) => {
              prev.set('tab', 'favorites');
              
              return prev;
            })} className="flex items-center gap-2">              
              Favorites ({favoriteCount})
            </TabsTrigger>
            <TabsTrigger value="heroes" onClick={()=> setSearchParams((prev) => {
              prev.set('tab', 'heroes');
              prev.set('category', 'hero');
              prev.set('page', '1');
              return prev;
            })}>
              Heroes ({summary?.heroCount})
            </TabsTrigger>
            <TabsTrigger value="villains" onClick={()=> setSearchParams((prev) => {
              prev.set('tab', 'villains');
              prev.set('category', 'villain');
              prev.set('page', '1');
              return prev;
            })}>
              Villains ({summary?.villainCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value={"all"}>
            {/* Mostrar todos los personajes */}
            <HeroGrid heroes={heroesResponse?.heroes}/>
          </TabsContent>
          <TabsContent value={"favorites"}>
            {/* Mostrar todos los personajes favoritos */}
            <HeroGrid heroes={favorites}/>
          </TabsContent>
          <TabsContent value={"heroes"}>
            {/* Mostrar todos los heroes */}
            <h1>Heroes</h1>
            <HeroGrid heroes={heroesResponse?.heroes}/>
          </TabsContent>
          <TabsContent value={"villains"}>
            {/* Mostrar todos los villanos */}
            <h1>Villanos</h1>
            <HeroGrid heroes={heroesResponse?.heroes}/>
          </TabsContent>
        </Tabs>

        {/* Character Grid */}
        

        {/* Pagination */}
        {
          selectedTab !== 'favorites' && (
            <CustomPagination totalPages={heroesResponse?.pages ?? 0}/>
          )
        }
        
      </>
    </>
  )
}