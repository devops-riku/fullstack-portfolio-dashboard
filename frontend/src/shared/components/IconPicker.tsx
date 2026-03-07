import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Search, Loader2, X, Zap } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

// Note: ScrollArea is missing from your ui components, 
// I'll stick to native overflow for now or look for it.
// Checking ui dir again... actually I'll just use a div with overflow.

interface IconPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (iconName: string) => void;
}

const SUGGESTED_ICONS = [
    'logos:react', 'logos:nextjs-icon', 'logos:vue', 'logos:angular-icon',
    'logos:tailwindcss-icon', 'logos:nodejs-icon', 'logos:typescript-icon',
    'logos:javascript', 'logos:python', 'logos:django-icon', 'logos:laravel',
    'logos:docker-icon', 'logos:kubernetes', 'logos:aws', 'logos:google-cloud',
    'logos:postgresql', 'logos:mongodb-icon', 'logos:redis', 'logos:graphql',
    'logos:figma', 'logos:framer', 'logos:sass', 'logos:github-icon',
    'logos:visual-studio-code', 'logos:git-icon', 'logos:pnpm'
];

export const IconPicker = ({ isOpen, onClose, onSelect }: IconPickerProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults(SUGGESTED_ICONS);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://api.iconify.design/search?query=${query}&limit=32`);
                const data = await res.json();
                if (data.icons) {
                    setResults(data.icons);
                }
            } catch (err) {
                console.error('Icon search failed', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white dark:bg-black border-gray-100 dark:border-white/10 p-0 overflow-hidden rounded-2xl shadow-2xl">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-black dark:text-white">
                        <Zap size={20} className="text-sky-400" />
                        Icon Master
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-400 font-medium">
                        Search 100,000+ tech logos and utility icons
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-4">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                        <Input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search (e.g. react, node, cloud...)"
                            className="h-14 bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 pl-12 text-sm font-bold focus-visible:ring-sky-400 placeholder:text-gray-300 placeholder:font-normal"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                            {results.map((icon) => (
                                <button
                                    key={icon}
                                    onClick={() => {
                                        onSelect(icon);
                                        onClose();
                                    }}
                                    className="aspect-square flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-black hover:bg-sky-50 dark:hover:bg-sky-400/10 hover:border-sky-200 dark:hover:border-sky-400/20 transition-all group relative animate-in fade-in zoom-in duration-200"
                                >
                                    {loading ? (
                                        <Loader2 size={24} className="animate-spin text-gray-200" />
                                    ) : (
                                        <Icon icon={icon} className="text-2xl text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                                    )}
                                    <span className="absolute bottom-1 text-[8px] font-black uppercase text-gray-300 dark:text-gray-600 truncate max-w-full px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {icon.split(':').pop()}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {!loading && results.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                <div className="p-4 rounded-full bg-gray-50 dark:bg-white/5">
                                    <Search size={32} strokeWidth={1} />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest">No icons found for "{query}"</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                        Powered by Iconify API
                    </span>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 text-[10px] font-black uppercase tracking-widest">
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
