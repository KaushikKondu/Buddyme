import { Dumbbell, Utensils, Trophy } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  label: string;
}

export function FeatureBanner() {
  const features: Feature[] = [
    {
      icon: <Dumbbell className="h-4 w-4 text-primary" />,
      label: "Gym Buddies"
    },
    {
      icon: <Utensils className="h-4 w-4 text-primary" />,
      label: "Cooking Partners"
    },
    {
      icon: <Trophy className="h-4 w-4 text-primary" />,
      label: "Sports Friends"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 py-4 px-6">
      <div className="flex flex-wrap justify-between items-center">
        {features.map((feature, index) => (
          <div key={index} className="text-center w-1/3 px-1 py-2 sm:py-0 sm:flex-1">
            <div className="mb-1 flex justify-center">
              {feature.icon}
            </div>
            <p className="text-xs font-medium text-neutral-500">{feature.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
