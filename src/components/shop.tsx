import React from "react";
import { 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  Check,
  X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const TITLES = [
  { id: "t1", name: "Kinematics King", price: 1000, description: "Show off your mastery of motion." },
  { id: "t2", name: "Vector Visionary", price: 1500, description: "For those who see the world in components." },
  { id: "t3", name: "Acceleration Ace", price: 2000, description: "Speed isn't everything, change is." },
  { id: "t4", name: "Projectile Pro", price: 2500, description: "Master of the parabolic path." },
];

const ACCESSORIES = [
  { id: "a1", name: "Golden Compass", price: 500, description: "A shiny tool for perfect directions." },
  { id: "a2", name: "Neon Stopwatch", price: 800, description: "Track time with style." },
  { id: "a3", name: "Holographic Ruler", price: 1200, description: "Measure displacement in 3D." },
  { id: "a4", name: "Jetpack Wings", price: 3000, description: "Defy gravity (visually)." },
];

export function Shop() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5" />}>
        <ShoppingBag className="w-4 h-4 text-primary" />
        <span>Shop</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            VECTRACE Shop
          </DialogTitle>
          <DialogDescription>
            Customize your profile with exclusive titles and accessories.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="titles" className="flex-1 flex flex-col">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="titles" className="gap-2">
                <Tag className="w-4 h-4" />
                Buy Titles
              </TabsTrigger>
              <TabsTrigger value="accessories" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Buy Accessories
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="titles" className="flex-1 mt-0">
            <ScrollArea className="h-full p-6">
              <div className="grid grid-cols-1 gap-4">
                {TITLES.map((title) => (
                  <div key={title.id} className="p-4 rounded-xl border bg-muted/30 flex items-center justify-between group hover:border-primary/50 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg">{title.name}</h4>
                      <p className="text-xs text-muted-foreground">{title.description}</p>
                    </div>
                    <Button size="sm" className="gap-2">
                      {title.price} Credits
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="accessories" className="flex-1 mt-0">
            <ScrollArea className="h-full p-6">
              <div className="grid grid-cols-2 gap-4">
                {ACCESSORIES.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border bg-muted/30 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
                    <div className="w-full aspect-square rounded-lg bg-background border flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-muted/20 group-hover:text-primary/20 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-[10px] text-muted-foreground leading-tight">{item.description}</p>
                    </div>
                    <Button size="sm" className="w-full mt-auto">
                      {item.price} Credits
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase">Your Balance:</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              2,450 Credits
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground italic">Items are currently placeholders.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
