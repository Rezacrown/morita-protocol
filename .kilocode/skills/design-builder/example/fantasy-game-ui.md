# Fantasy Game UI Example

Contoh implementasi UI game dengan design preset Fantasy.

## Design System Configuration

```json
{
  "preset": "fantasy",
  "colors": {
    "primary": "#7C3AED",
    "secondary": "#A855F7",
    "accent": "#F59E0B",
    "gold": "#FFD700",
    "background": "#0F0F1A",
    "surface": "#1A1A2E",
    "card": "#16213E",
    "text": {
      "primary": "#E2E8F0",
      "secondary": "#94A3B8",
      "accent": "#F59E0B"
    },
    "rarity": {
      "common": "#9CA3AF",
      "uncommon": "#22C55E",
      "rare": "#3B82F6",
      "epic": "#A855F7",
      "legendary": "#F59E0B"
    }
  },
  "typography": {
    "fontFamily": {
      "heading": "Cinzel, serif",
      "body": "Inter, sans-serif"
    },
    "effects": {
      "glow": "0 0 20px rgba(168, 85, 247, 0.5)",
      "textShadow": "0 0 10px rgba(245, 158, 11, 0.5)"
    }
  },
  "effects": {
    "borders": {
      "glow": "1px solid rgba(168, 85, 247, 0.5)",
      "gold": "1px solid rgba(245, 158, 11, 0.5)"
    },
    "animations": {
      "pulse": "pulse-glow 2s ease-in-out infinite",
      "float": "float 3s ease-in-out infinite"
    }
  }
}
```

## Component Structure

```
app/
├── game/
│   ├── layout.tsx          # Game layout
│   ├── page.tsx           # Main game screen
│   ├── character/
│   │   └── page.tsx       # Character screen
│   ├── inventory/
│   │   └── page.tsx       # Inventory screen
│   └── shop/
│       └── page.tsx       # Shop screen
└── components/
    ├── game/
    │   ├── CharacterCard.tsx
    │   ├── StatBar.tsx
    │   ├──
    │   ItemSlot.tsx └── ActionButton.tsx
    ├── ui/
    │   ├── GlowingBorder.tsx
    │   ├── ParticleEffect.tsx
    │   └── MagicalText.tsx
    └── layout/
        ├── GameHeader.tsx
        └── NavigationBar.tsx
```

## Key Components

### Glowing Border Effect

```tsx
// components/ui/GlowingBorder.tsx
import { cn } from "@/lib/utils";

interface GlowingBorderProps {
  children: React.ReactNode;
  color?: "purple" | "gold" | "blue";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

const colorStyles = {
  purple: {
    border: "border border-purple-500/50",
    glow: {
      low: "shadow-[0_0_10px_rgba(168,85,247,0.3)]",
      medium: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
      high: "shadow-[0_0_30px_rgba(168,85,247,0.7)]",
    },
  },
  gold: {
    border: "border border-amber-500/50",
    glow: {
      low: "shadow-[0_0_10px_rgba(245,158,11,0.3)]",
      medium: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
      high: "shadow-[0_0_30px_rgba(245,158,11,0.7)]",
    },
  },
  blue: {
    border: "border border-blue-500/50",
    glow: {
      low: "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
      medium: "shadow-[0_0_20px_rgba(59,130,246,0.5)]",
      high: "shadow-[0_0_30px_rgba(59,130,246,0.7)]",
    },
  },
};

export function GlowingBorder({
  children,
  color = "purple",
  intensity = "medium",
  className,
}: GlowingBorderProps) {
  const style = colorStyles[color];

  return (
    <div
      className={cn(
        "relative rounded-xl bg-surface/80 backdrop-blur-sm",
        style.border,
        style.glow[intensity],
        className,
      )}
    >
      {/* Corner decorations */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-purple-500 rounded-tl-lg" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-purple-500 rounded-tr-lg" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-purple-500 rounded-bl-lg" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-purple-500 rounded-br-lg" />

      {children}
    </div>
  );
}
```

### Character Card

```tsx
// components/game/CharacterCard.tsx
import { GlowingBorder } from "@/components/ui/GlowingBorder";

interface CharacterStats {
  health: number;
  mana: number;
  stamina: number;
  strength: number;
  intelligence: number;
  agility: number;
}

interface CharacterCardProps {
  name: string;
  level: number;
  class: string;
  avatar: string;
  stats: CharacterStats;
  experience: {
    current: number;
    required: number;
  };
}

export function CharacterCard({
  name,
  level,
  class: charClass,
  avatar,
  stats,
  experience,
}: CharacterCardProps) {
  const expPercentage = (experience.current / experience.required) * 100;

  return (
    <GlowingBorder color="gold" intensity="medium">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {/* Avatar frame */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 p-1">
              <div className="w-full h-full rounded-full bg-surface overflow-hidden">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold text-black">
              {level}
            </div>
          </div>

          <div>
            <h2
              className="text-2xl font-cinzel text-amber-400"
              style={{ textShadow: "0 0 10px rgba(245,158,11,0.5)" }}
            >
              {name}
            </h2>
            <p className="text-purple-400">{charClass}</p>
          </div>
        </div>

        {/* Experience Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Experience</span>
            <span>
              {experience.current} / {experience.required}
            </span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-500"
              style={{ width: `${expPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatDisplay label="Health" value={stats.health} color="red" />
          <StatDisplay label="Mana" value={stats.mana} color="blue" />
          <StatDisplay label="Stamina" value={stats.stamina} color="green" />
          <StatDisplay label="Strength" value={stats.strength} color="orange" />
          <StatDisplay
            label="Intelligence"
            value={stats.intelligence}
            color="purple"
          />
          <StatDisplay label="Agility" value={stats.agility} color="cyan" />
        </div>
      </div>
    </GlowingBorder>
  );
}

function StatDisplay({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
  };

  return (
    <div className="bg-surface/50 rounded-lg p-2">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="h-1 mt-1 bg-surface rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
```

### Item Slot

```tsx
// components/game/ItemSlot.tsx
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  name: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  quantity?: number;
}

interface ItemSlotProps {
  item?: Item;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const rarityColors = {
  common: {
    border: "border-gray-500/50",
    glow: "shadow-none",
    text: "text-gray-400",
  },
  uncommon: {
    border: "border-green-500/50",
    glow: "shadow-[0_0_10px_rgba(34,197,94,0.3)]",
    text: "text-green-400",
  },
  rare: {
    border: "border-blue-500/50",
    glow: "shadow-[0_0_10px_rgba(59,130,246,0.4)]",
    text: "text-blue-400",
  },
  epic: {
    border: "border-purple-500/60",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    text: "text-purple-400",
  },
  legendary: {
    border: "border-amber-500/70",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.6)]",
    text: "text-amber-400",
  },
};

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

export function ItemSlot({ item, size = "md", onClick }: ItemSlotProps) {
  if (!item) {
    return (
      <div
        className={cn(
          "rounded-lg border border-gray-700/50 bg-surface/30",
          sizeClasses[size],
        )}
      />
    );
  }

  const rarity = rarityColors[item.rarity];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-lg border bg-surface/80 transition-all hover:scale-105",
        rarity.border,
        rarity.glow,
        sizeClasses[size],
      )}
    >
      {/* Item icon */}
      <div className="absolute inset-1 flex items-center justify-center">
        <img
          src={item.icon}
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Quantity badge */}
      {item.quantity && item.quantity > 1 && (
        <div className="absolute -bottom-1 -right-1 min-w-5 h-5 px-1 bg-black/80 rounded text-xs text-white flex items-center justify-center">
          {item.quantity}
        </div>
      )}

      {/* Rarity indicator */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg opacity-20",
          rarityColors[item.rarity].border.replace("border-", "bg-"),
        )}
      />
    </button>
  );
}
```

### Action Button

```tsx
// components/game/ActionButton.tsx
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  variant?: "attack" | "defend" | "skill" | "item" | "magic";
  onClick?: () => void;
  cooldown?: number;
  disabled?: boolean;
}

const variantStyles = {
  attack: {
    base: "bg-red-600 hover:bg-red-500",
    glow: "hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]",
    border: "border-red-500/50",
  },
  defend: {
    base: "bg-blue-600 hover:bg-blue-500",
    glow: "hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]",
    border: "border-blue-500/50",
  },
  skill: {
    base: "bg-purple-600 hover:bg-purple-500",
    glow: "hover:shadow-[0_0_20px_rgba(147,51,234,0.6)]",
    border: "border-purple-500/50",
  },
  item: {
    base: "bg-green-600 hover:bg-green-500",
    glow: "hover:shadow-[0_0_20px_rgba(22,163,74,0.6)]",
    border: "border-green-500/50",
  },
  magic: {
    base: "bg-cyan-600 hover:bg-cyan-500",
    glow: "hover:shadow-[0_0_20px_rgba(8,145,178,0.6)]",
    border: "border-cyan-500/50",
  },
};

export function ActionButton({
  label,
  icon,
  variant = "skill",
  onClick,
  cooldown,
  disabled,
}: ActionButtonProps) {
  const style = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled || (cooldown && cooldown > 0)}
      className={cn(
        "relative px-6 py-4 rounded-lg border transition-all duration-200",
        "flex flex-col items-center gap-2 font-bold uppercase tracking-wider",
        style.base,
        style.glow,
        style.border,
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {icon && <div className="text-2xl">{icon}</div>}
      <span className="text-white">{label}</span>

      {/* Cooldown overlay */}
      {cooldown && cooldown > 0 && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
          <span className="text-amber-400 font-mono">{cooldown}s</span>
        </div>
      )}
    </button>
  );
}
```

### Magical Text Effect

```tsx
// components/ui/MagicalText.tsx
import { cn } from "@/lib/utils";

interface MagicalTextProps {
  children: React.ReactNode;
  variant?: "gold" | "purple" | "rainbow";
  className?: string;
}

export function MagicalText({
  children,
  variant = "gold",
  className,
}: MagicalTextProps) {
  const variants = {
    gold: "text-amber-400",
    purple: "text-purple-400",
    rainbow: "animate-rainbow",
  };

  return (
    <span
      className={cn(
        "font-cinzel",
        variants[variant],
        "transition-all hover:scale-105",
        className,
      )}
      style={{
        textShadow:
          variant === "gold"
            ? "0 0 10px rgba(245,158,11,0.5), 0 0 20px rgba(245,158,11,0.3)"
            : variant === "purple"
              ? "0 0 10px rgba(168,85,247,0.5), 0 0 20px rgba(168,85,247,0.3)"
              : undefined,
      }}
    >
      {children}
    </span>
  );
}
```

## Game Screen Implementation

```tsx
// app/game/page.tsx
import { CharacterCard } from "@/components/game/CharacterCard";
import { ActionButton } from "@/components/game/ActionButton";
import { ItemSlot } from "@/components/game/ItemSlot";
import { MagicalText } from "@/components/ui/MagicalText";

export default function GamePage() {
  const character = {
    name: "Arthorius",
    level: 25,
    class: "Spellblade",
    avatar: "/characters/arthorius.png",
    stats: {
      health: 850,
      mana: 620,
      stamina: 480,
      strength: 65,
      intelligence: 72,
      agility: 58,
    },
    experience: {
      current: 4250,
      required: 5000,
    },
  };

  const inventory: Array<{
    id: string;
    name: string;
    icon: string;
    rarity: any;
    quantity: number;
  }> = [
    {
      id: "1",
      name: "Dragon Sword",
      icon: "/items/sword.png",
      rarity: "epic",
      quantity: 1,
    },
    {
      id: "2",
      name: "Health Potion",
      icon: "/items/potion.png",
      rarity: "common",
      quantity: 10,
    },
    {
      id: "3",
      name: "Mana Crystal",
      icon: "/items/crystal.png",
      rarity: "uncommon",
      quantity: 5,
    },
  ];

  return (
    <div
      className="min-h-screen bg-background p-6"
      style={{
        background: "linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <MagicalText variant="gold" className="text-3xl">
          Realm of Shadows
        </MagicalText>
        <div className="flex gap-4">
          <span className="text-gray-400">
            Gold: <span className="text-amber-400">12,450</span>
          </span>
          <span className="text-gray-400">
            Gems: <span className="text-purple-400">1,200</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Character Panel */}
        <div className="col-span-4">
          <CharacterCard {...character} />
        </div>

        {/* Main Game Area */}
        <div className="col-span-8 space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <ActionButton
              label="Attack"
              variant="attack"
              icon={<SwordIcon />}
            />
            <ActionButton
              label="Defend"
              variant="defend"
              icon={<ShieldIcon />}
            />
            <ActionButton
              label="Skill"
              variant="skill"
              icon={<SparklesIcon />}
            />
            <ActionButton label="Item" variant="item" icon={<PackageIcon />} />
            <ActionButton label="Magic" variant="magic" icon={<WandIcon />} />
          </div>

          {/* Quick Access Bar */}
          <div className="bg-surface/50 rounded-xl p-4 border border-purple-500/30">
            <h3 className="text-purple-400 mb-4 font-cinzel">Quick Access</h3>
            <div className="flex gap-2">
              {inventory.map((item) => (
                <ItemSlot key={item.id} item={item} size="lg" />
              ))}
              {[...Array(5)].map((_, i) => (
                <ItemSlot key={`empty-${i}`} size="lg" />
              ))}
            </div>
          </div>

          {/* Game Log */}
          <div className="bg-surface/50 rounded-xl p-4 border border-purple-500/30 h-48 overflow-y-auto">
            <h3 className="text-purple-400 mb-2 font-cinzel">Battle Log</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-400">[12:45]</span> You deal{" "}
                <span className="text-red-400">125</span> damage to Shadow
                Beast!
              </p>
              <p>
                <span className="text-gray-400">[12:44]</span> Shadow Beast
                casts <span className="text-purple-400">Dark Bolt</span> for{" "}
                <span className="text-red-400">45</span> damage.
              </p>
              <p>
                <span className="text-gray-400">[12:43]</span> You use{" "}
                <span className="text-green-400">Health Potion</span> and
                restore <span className="text-green-400">150</span> HP.
              </p>
              <p>
                <span className="text-gray-400">[12:42]</span>{" "}
                <span className="text-amber-400">Epic!</span> You found{" "}
                <span className="text-purple-400">Dragon Sword</span>!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## CSS Animations

```css
/* globals.css */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(168, 85, 247, 0.6);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes rainbow {
  0% {
    color: #ff0000;
  }
  16% {
    color: #ff0000;
  }
  33% {
    color: #ffff00;
  }
  50% {
    color: #00ff00;
  }
  66% {
    color: #00ffff;
  }
  83% {
    color: #0000ff;
  }
  100% {
    color: #ff0000;
  }
}

.font-cinzel {
  font-family: "Cinzel", serif;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-rainbow {
  animation: rainbow 3s linear infinite;
}
```

## Best Practices

1. **Immersive effects** - Glow, particles, animations
2. **Fantasy typography** - Cinzel, medieval-style fonts
3. **Rarity color system** - Common to Legendary
4. **Interactive feedback** - Hover effects, click states
5. **Audio integration** - Sound effects for actions
6. **Particle effects** - Background ambiance
