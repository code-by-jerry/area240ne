import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Calculator,
    Image as ImageIcon,
    Images,
    Users,
    Sparkles,
    MessageCircleMore,
    MessageSquareDashed,
    Database,
    ListChecks,
    FlaskConical,
    MessageSquareQuote,
    Upload,
    MessagesSquare,
    Settings2,
    ClipboardList,
    Blocks,
    Newspaper,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavGroups = [
    {
        title: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Business',
        items: [
            {
                title: 'Users',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Leads',
                href: '/leads',
                icon: ClipboardList,
            },
            {
                title: 'Cost Estimations',
                href: '/admin/cost-estimations',
                icon: Calculator,
            },
            {
                title: 'Hero Slides',
                href: '/admin/hero-slides',
                icon: ImageIcon,
            },
            {
                title: 'Blogs',
                href: '/admin/blogs',
                icon: Newspaper,
            },
            {
                title: 'Media Assets',
                href: '/admin/media-assets',
                icon: Images,
            },
        ],
    },
    {
        title: 'Chat Assistant',
        items: [
            {
                title: 'Chat Settings',
                href: '/admin/chat-settings',
                icon: Settings2,
            },
            {
                title: 'Chat Services',
                href: '/admin/chat-services',
                icon: Blocks,
            },
            {
                title: 'Qualification Flows',
                href: '/admin/chat-qualification-flows',
                icon: ListChecks,
            },
            {
                title: 'Chat Intents',
                href: '/admin/chat-intents',
                icon: Sparkles,
            },
            {
                title: 'Chat Knowledge',
                href: '/admin/chat-knowledge-items',
                icon: Database,
            },
            {
                title: 'Response Templates',
                href: '/admin/chat-response-templates',
                icon: MessageSquareQuote,
            },
        ],
    },
    {
        title: 'Operations',
        items: [
            {
                title: 'Chat Imports',
                href: '/admin/chat-imports',
                icon: Upload,
            },
            {
                title: 'Chat Sessions',
                href: '/admin/chat-sessions',
                icon: MessagesSquare,
            },
            {
                title: 'Chat Tester',
                href: '/admin/chat-tester',
                icon: FlaskConical,
            },
        ],
    },
] satisfies Array<{ title: string; items: NavItem[] }>;

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={mainNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

