"use client";  // Indicates that this component should be rendered on the client side.

import { useCodeEditorStore } from "@/store/useCodeEditorStore";  // Custom store for managing the code editor's state.
import React, { useEffect, useRef, useState } from "react";  // Importing React hooks for state and side effects.
import { THEMES } from "../_constants";  // Importing the list of available themes.
import { AnimatePresence, motion } from "framer-motion";  // For adding animation when the theme selector is opened.
import { CircleOff, Cloud, Github, Laptop, Moon, Palette, Sun } from "lucide-react";  // Importing icons for the themes.
import useMounted from "@/hooks/useMounted";  // A custom hook to check if the component is mounted (useful for SSR).

// Icon mapping for different themes.
const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-4" />,  // Icon for dark theme.
  "vs-light": <Sun className="size-4" />,  // Icon for light theme.
  "github-dark": <Github className="size-4" />,  // GitHub dark theme icon.
  monokai: <Laptop className="size-4" />,  // Monokai theme icon.
  "solarized-dark": <Cloud className="size-4" />,  // Solarized dark theme icon.
};

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);  // State to track if the theme dropdown is open.
  const mounted = useMounted();  // Custom hook to check if the component is mounted.
  const { theme, setTheme } = useCodeEditorStore();  // Get current theme and a function to update the theme from the store.
  const dropdownRef = useRef<HTMLDivElement>(null);  // Ref to track the dropdown element for handling outside clicks.
  const currentTheme = THEMES.find((t) => t.id === theme);  // Find the current theme object by the theme id.

  // Effect hook to handle closing the dropdown if a click is made outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);  // Close the dropdown if clicked outside.
      }
    };

    document.addEventListener("mousedown", handleClickOutside);  // Add the event listener for outside clicks.
    return () => document.removeEventListener("mousedown", handleClickOutside);  // Clean up the event listener on component unmount.
  }, []);

  // Prevent rendering before the component is mounted.
  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}  // Animate scale when hovered.
        whileTap={{ scale: 0.98 }}  // Animate scale when clicked.
        onClick={() => setIsOpen(!isOpen)}  // Toggle the dropdown open state when clicked.
        className="w-48 group relative flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e]/80 hover:bg-[#262637] 
        rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700"
      >
        {/* Hover state background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Theme icon */}
        <Palette className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />

        {/* Display the current theme's label */}
        <span className="text-gray-300 min-w-[80px] text-left group-hover:text-white transition-colors">
          {currentTheme?.label}
        </span>

        {/* Color indicator circle */}
        <div
          className="relative w-4 h-4 rounded-full border border-gray-600 group-hover:border-gray-500 transition-colors"
          style={{ background: currentTheme?.color }}  // Set the background color based on the current theme.
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (  // If the dropdown is open, animate its appearance.
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}  // Initial animation state.
            animate={{ opacity: 1, y: 0, scale: 1 }}  // Animation when opening.
            exit={{ opacity: 0, y: 8, scale: 0.96 }}  // Animation when closing.
            transition={{ duration: 0.2 }}  // Animation duration.
            className="absolute top-full left-0 mt-2 w-full min-w-[240px] bg-[#1e1e2e]/95 
            backdrop-blur-xl rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
          >
            <div className="px-2 pb-2 mb-2 border-b border-gray-800/50">
              <p className="text-xs font-medium text-gray-400 px-2">Select Theme</p>
            </div>

            {/* Iterate through the available themes and create a button for each */}
            {THEMES.map((t, index) => (
              <motion.button
                key={t.id}  // Use the theme's id as the key.
                initial={{ opacity: 0 }}  // Initial animation state.
                animate={{ opacity: 1 }}  // Animation for the appearance of each button.
                transition={{ delay: index * 0.1 }}  // Delay each theme button's appearance slightly for smooth effect.
                className={`relative group w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#262637] transition-all duration-200
                ${theme === t.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"}`}  // Highlight the selected theme.
                onClick={() => setTheme(t.id)}  // Set the selected theme when clicked.
              >
                {/* Background gradient for hover effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 
                  group-hover:opacity-100 transition-opacity"
                />

                {/* Theme icon */}
                <div
                  className={`
                  flex items-center justify-center size-8 rounded-lg
                  ${theme === t.id ? "bg-blue-500/10 text-blue-400" : "bg-gray-800/50 text-gray-400"}
                  group-hover:scale-110 transition-all duration-200
                `}
                >
                  {THEME_ICONS[t.id] || <CircleOff className="w-4 h-4" />}  {/* Default icon if none found */}
                </div>

                {/* Theme label */}
                <span className="flex-1 text-left group-hover:text-white transition-colors">
                  {t.label}
                </span>

                {/* Theme color indicator */}
                <div
                  className="relative size-4 rounded-full border border-gray-600 
                  group-hover:border-gray-500 transition-colors"
                  style={{ background: t.color }}  // Set color indicator based on the theme color.
                />

                {/* Border to highlight active theme */}
                {theme === t.id && (
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-500/30 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeSelector;
