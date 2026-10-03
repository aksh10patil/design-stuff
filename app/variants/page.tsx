"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
    Layers,
    LayoutGrid,
    Palette,
    Sliders,
    Sparkles,
    FolderKanban,
    Users,
    Settings,
    HelpCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    X,
    LogOut,
} from "lucide-react";

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        title: "General",
        items: [
            { id: "overview", label: "Overview", icon: LayoutGrid },
            { id: "variants", label: "Component Variants", icon: Layers, badge: "24" },
            { id: "tokens", label: "Design Tokens", icon: Sliders },
            { id: "palettes", label: "Color Systems", icon: Palette },
            { id: "motion", label: "Micro-interactions", icon: Sparkles, badge: "New" },
        ],
    },
    {
        title: "Workspace",
        items: [
            { id: "projects", label: "Projects", icon: FolderKanban },
            { id: "team", label: "Team Members", icon: Users, badge: "4" },
        ],
    },
    {
        title: "System",
        items: [
            { id: "docs", label: "Documentation", icon: HelpCircle },
            { id: "settings", label: "Settings", icon: Settings },
        ],
    },
];

// Motion variants for staggering list items on initial load / search
const listContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.05,
        },
    },
};

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.02,
        },
    },
};

const listItemVariants: Variants = {
    hidden: {
        opacity: 0,
        x: -14,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 360,
            damping: 24,
        },
    },
};

// Motion variants specifically for staggering the nav item icons when closing/collapsing the sidebar
const iconVariants: Variants = {
    expanded: (index: number) => ({
        scale: 1,
        rotate: 0,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 380,
            damping: 24,
            delay: index * 0.02,
        },
    }),
    collapsed: (index: number) => ({
        scale: [1, 0.7, 1.28, 1],
        rotate: [0, -14, 8, 0],
        x: [0, -3, 2, 0],
        transition: {
            delay: index * 0.045, // Cascading stagger across icons on sidebar close
            duration: 0.42,
            ease: "easeOut",
        },
    }),
};

export default function VariantsPage() {
    const [activeTab, setActiveTab] = useState("variants");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSections = navSections
        .map((section) => ({
            ...section,
            items: section.items.filter((item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((section) => section.items.length > 0);

    const allFilteredItems = filteredSections.flatMap((s) => s.items);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-neutral-50 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-200/80 bg-white shadow-xs transition-all duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-900 lg:static ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                } ${isCollapsed ? "w-20" : "w-64"}`}
            >
                {/* Brand / Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/70 px-4 dark:border-neutral-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <AnimatePresence initial={false}>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex min-w-0 flex-col"
                                >
                                    <span className="truncate font-semibold text-sm tracking-tight text-neutral-900 dark:text-white">
                                        Variants Studio
                                    </span>
                                    <span className="truncate text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                                        Design System v2.4
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 lg:flex"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 lg:hidden"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Quick Search */}
                <AnimatePresence initial={false}>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden px-3 pt-3"
                        >
                            <div className="relative flex items-center">
                                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Quick find..."
                                    className="w-full rounded-lg border border-neutral-200/80 bg-neutral-50/70 py-1.5 pr-2.5 pl-9 text-xs text-neutral-800 placeholder-neutral-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:border-blue-500 dark:focus:bg-neutral-900"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Items with Staggered Motion Animations */}
                <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-none">
                    <motion.nav
                        key={searchQuery}
                        variants={listContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {filteredSections.map((section) => (
                            <motion.div
                                key={section.title}
                                variants={sectionVariants}
                                className="space-y-1"
                            >
                                <AnimatePresence initial={false}>
                                    {!isCollapsed && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="overflow-hidden px-2.5 pb-1.5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
                                        >
                                            {section.title}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    const itemIndex = allFilteredItems.findIndex(
                                        (i) => i.id === item.id
                                    );

                                    return (
                                        <motion.div
                                            key={item.id}
                                            variants={listItemVariants}
                                            whileHover={{ x: isCollapsed ? 0 : 3 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <button
                                                onClick={() => {
                                                    setActiveTab(item.id);
                                                    setMobileOpen(false);
                                                }}
                                                className={`group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all ${
                                                    isActive
                                                        ? "bg-blue-50/90 text-blue-600 shadow-xs dark:bg-blue-500/10 dark:text-blue-400"
                                                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100"
                                                } ${isCollapsed ? "justify-center px-0" : ""}`}
                                                title={isCollapsed ? item.label : undefined}
                                            >
                                                {isActive && (
                                                    <motion.span
                                                        layoutId="activeIndicator"
                                                        className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-blue-600 dark:bg-blue-500"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 350,
                                                            damping: 30,
                                                        }}
                                                    />
                                                )}

                                                {/* Icon with closing stagger animation */}
                                                <motion.div
                                                    custom={itemIndex}
                                                    variants={iconVariants}
                                                    animate={isCollapsed ? "collapsed" : "expanded"}
                                                    initial={false}
                                                    className="flex shrink-0 items-center justify-center"
                                                >
                                                    <Icon
                                                        className={`h-4.5 w-4.5 transition-colors duration-150 ${
                                                            isActive
                                                                ? "text-blue-600 dark:text-blue-400"
                                                                : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                                                        }`}
                                                    />
                                                </motion.div>

                                                <AnimatePresence initial={false} mode="wait">
                                                    {!isCollapsed && (
                                                        <motion.div
                                                            initial={{ opacity: 0, width: 0 }}
                                                            animate={{ opacity: 1, width: "auto" }}
                                                            exit={{ opacity: 0, width: 0 }}
                                                            transition={{
                                                                duration: 0.18,
                                                                ease: "easeInOut",
                                                            }}
                                                            className="flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap"
                                                        >
                                                            <span className="truncate">{item.label}</span>
                                                            {item.badge && (
                                                                <span
                                                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${
                                                                        isActive
                                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                                                                            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                                                                    }`}
                                                                >
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ))}
                    </motion.nav>
                </div>

                {/* User Profile / Footer */}
                <div className="border-t border-neutral-200/70 p-3 dark:border-neutral-800">
                    <div
                        className={`flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/70 ${
                            isCollapsed ? "justify-center p-0" : ""
                        }`}
                    >
                        <div className="relative h-8 w-8 shrink-0">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-tr from-amber-500 to-rose-500 font-semibold text-xs text-white">
                                RP
                            </div>
                            <span className="absolute right-0 bottom-0 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                        </div>

                        <AnimatePresence initial={false}>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                            Rajdeep Patil
                                        </p>
                                        <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                                            Pro Workspace
                                        </p>
                                    </div>
                                    <button
                                        className="rounded p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                        aria-label="User menu"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </aside>
        </div>
    );
}
