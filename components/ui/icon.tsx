import {
  BriefcaseBusiness,
  CarFront,
  Clock3,
  Hotel,
  type LucideIcon,
  type LucideProps,
  Map as MapIcon,
  MessageCircleMore,
  Plane,
  Route,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Sun,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import type { IconName } from "@/lib/types";

const icons: Record<IconName, LucideIcon> = {
  plane: Plane,
  hotel: Hotel,
  family: UsersRound,
  briefcase: BriefcaseBusiness,
  map: MapIcon,
  users: Users,
  desert: Sun,
  clock: Clock3,
  shield: ShieldCheck,
  sparkles: Sparkles,
  message: MessageCircleMore,
  car: CarFront,
  route: Route,
  smile: Smile,
  star: Star,
  wallet: Wallet,
};

export function Icon({ name, ...props }: { name: IconName | string } & LucideProps) {
  const Component = icons[name as IconName] ?? CarFront;
  return <Component aria-hidden {...props} />;
}
