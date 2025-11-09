import { Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";



export default function Header() {
    return (
        <div className="w-full flex-col justify-center mx-auto">
            <NavigationMenu className="mx-auto mt-5">
                <NavigationMenuList className="">
                    <NavigationMenuItem >
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/">Home</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/Ocorrencia">Relatar Ocorrência</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/Consulta">Mostrar Ocorrências</Link>
                        </NavigationMenuLink>
                        <NavigationMenuContent>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}