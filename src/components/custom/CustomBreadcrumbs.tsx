import { SlashIcon } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb"
import { Link } from "react-router"

interface Breadcrumb {
    label: string;
    to: string;
}
interface Props {
    currentPage : string
    breadcrumbs?:Breadcrumb[]
}
export const CustomBreadcrumbs: React.FC<Props> = ({currentPage, breadcrumbs = []}) => {
    return (
        <Breadcrumb className="mb-5">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to={"/"}>Inicio</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>

                {
                    breadcrumbs.map((breadcrumb) => (
                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to={breadcrumb.to}>{breadcrumb.label}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon />
                            </BreadcrumbSeparator>
                        </div>
                    ))
                }

                <BreadcrumbItem>
                    <BreadcrumbLink>{currentPage}</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
