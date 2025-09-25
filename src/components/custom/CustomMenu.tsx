
import { Link, useLocation } from 'react-router'
import { cn } from '../../lib/utils';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '../ui/navigation-menu';
import { NavigationMenuList } from '@radix-ui/react-navigation-menu';

export const CustomMenu = () => {

    const { pathname } = useLocation();

    const isActive = (path:string) => {
        return pathname === path;
    }

    return (
        <NavigationMenu className='pb-5'>
            <NavigationMenuList aria-orientation='vertical' className='flex flex-row'>

                {/* Home */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild
                        className={cn( isActive('/') && 'bg-slate-200', 'rounded-md p-2')}
                    >
                        <Link to="/">Inicio</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Search */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild
                        className={cn( isActive('/search') && 'bg-slate-200', 'rounded-md p-2')}
                    >
                        <Link to="/search">Buscar superheroes</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    )
}
