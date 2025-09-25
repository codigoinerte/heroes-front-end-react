import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { searchHeroesAction } from "@/heroes/actions/search-heroes.action";
import { HeroGrid } from "@/heroes/components/HeroGrid";

export const SearchPage = () => {

  //TODO: useQuery
  const [ searchParams ] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const strength = searchParams.get('strength') ?? '0';

  const { data: heroes = []} = useQuery({
    queryKey: ['search', {name, strength}],
    queryFn: () => searchHeroesAction({name, strength}),
    staleTime: 1000 * 60 * 5
  })

  return (
    <>
      <CustomJumbotron title="Búsqueda de heroes" description="Descubre, explora y administra super heroes y villanos" />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Controls */}
      <SearchControls />

      <HeroGrid heroes={heroes}/>

    </>
  )
}

export default SearchPage;