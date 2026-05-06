"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

type StackGridItem = {
  id: number
  name: string
  designation: string
  image: string
}

export const StackGrid = ({ items }: { items: StackGridItem[] }) => {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-4 md:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative flex items-center justify-center"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 260, damping: 18 },
                }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                style={{ whiteSpace: "nowrap" }}
                className="pointer-events-none absolute -top-12 z-50 flex flex-col items-center justify-center rounded-md border border-border bg-popover px-3 py-1.5 shadow-md"
              >
                <div className="text-sm font-semibold text-popover-foreground">
                  {item.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            src={item.image}
            alt={item.name}
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  )
}
