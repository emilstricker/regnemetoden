import { signOutUser } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
  onResetPlan: () => void;
}

export function Header({ onResetPlan }: HeaderProps) {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 sticky top-0 w-full border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-2xl font-bold tracking-tight p-0 hover:bg-transparent">
            Regnemetoden
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Nulstil Plan
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dette vil slette din nuværende vægtplan og alle dine indtastede data.
                  Du skal oprette en ny plan bagefter.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuller</AlertDialogCancel>
                <AlertDialogAction onClick={onResetPlan}>
                  Nulstil Plan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DropdownMenuItem onSelect={() => signOutUser()}>
            Log ud
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
