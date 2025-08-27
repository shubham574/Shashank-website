"use client";

import React, { useState, useEffect, useRef } from "react";
import DraggableResizableCal from "../../components/cal";
import { useRevealer } from "@/hooks/useRevealer";

interface Position {
  x: number;
  y: number;
}

interface SocialData {
  id: string;
  text1: string;
  text2: string;
  url: string;
  width?: number;
  height?: number;
}

interface DraggedItem {
  id: string;
  offset: Position;
}

interface Positions {
  [key: string]: Position;
}

interface FlipStates {
  [key: string]: boolean;
}

interface AutoFlipStates {
  [key: string]: boolean;
}

const DRAG_PADDING = 20; // padding to prevent dragging fully offscreen

const DraggableTextFlipper: React.FC = () => {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [positions, setPositions] = useState<Positions>({});
  const [flipStates, setFlipStates] = useState<FlipStates>({});
  const [autoFlipStates, setAutoFlipStates] = useState<AutoFlipStates>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasDragged, setHasDragged] = useState<boolean>(false);
  const [mouseDownPosition, setMouseDownPosition] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const autoFlipIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const socialData: SocialData[] = [
    {
      id: "instagram",
      text1: "INSTAGRAM",
      text2: "@YOURHANDLE",
      url: "https://instagram.com/yourhandle",
      width: 400,
      height: 100,
    },
    {
      id: "twitter",
      text1: "X / TWITTER",
      text2: "@YOURNAME",
      url: "https://twitter.com/yourname",
      width: 400,
      height: 100,
    },
    {
      id: "linkedin",
      text1: "LINKEDIN",
      text2: "CONNECT NOW",
      url: "https://linkedin.com/in/yourname",
      width: 400,
      height: 100,
    },
    {
      id: "github",
      text1: "GITHUB",
      text2: "CODE REPOS",
      url: "https://github.com/yourname",
      width: 400,
      height: 100,
    },
    {
      id: "email",
      text1: "EMAIL",
      text2: "CONTACT ME",
      url: "mailto:hello@yourname.com",
      width: 400,
      height: 100,
    },
    {
      id: "calendar",
      text1: "SCHEDULE",
      text2: "BOOK A CALL",
      url: "#",
      width: Math.min(400, typeof window !== "undefined" ? window.innerWidth * 0.28 : 350),
      height: typeof window !== "undefined" ? window.innerHeight - 200 : 600,
    },
  ];

  const isOverlapping = (
    pos1: Position,
    pos2: Position,
    width1: number,
    height1: number,
    width2: number,
    height2: number
  ) => {
    return !(
      pos1.x + width1 < pos2.x ||
      pos2.x + width2 < pos1.x ||
      pos1.y + height1 < pos2.y ||
      pos2.y + height2 < pos1.y
    );
  };

  // Generate random non-overlapping positions anywhere in the viewport
  const generateRandomPositions = () => {
    const positions: Position[] = [];
    const maxAttempts = 50;
    const padding = 60;

    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    const minX = 50;
    const maxX = viewportWidth - 400 - 50; // assuming max width 400
    const minY = 150;
    const maxY = viewportHeight - 100 - 150; // assuming height 100 (+ padding)

    socialData.forEach((item, index) => {
      let newPosition: Position = { x: 0, y: 0 };
      let attempts = 0;
      let validPosition = false;

      do {
        newPosition = {
          x: minX + Math.random() * (maxX - minX),
          y: minY + Math.random() * (maxY - minY),
        };

        validPosition = positions.every((existingPos, i) => {
          const existingItem = socialData[i];
          const w1 = item.width ?? 400;
          const h1 = item.height ?? 100;
          const w2 = existingItem.width ?? 400;
          const h2 = existingItem.height ?? 100;

          return !isOverlapping(
            newPosition,
            existingPos,
            w1 + padding,
            h1 + padding,
            w2 + padding,
            h2 + padding
          );
        });

        attempts++;
      } while (!validPosition && attempts < maxAttempts);

      if (!validPosition) {
        // fallback grid layout
        const gridCols = 3;
        const row = Math.floor(index / gridCols);
        const col = index % gridCols;
        newPosition = {
          x: minX + col * ((maxX - minX) / gridCols),
          y: minY + row * (100 + padding * 2),
        };
      }

      positions.push(newPosition);
    });

    return positions;
  };

  useEffect(() => {
    const initializePositions = () => {
      const initialPosArray = generateRandomPositions();
      const initialPositions: Positions = {};

      socialData.forEach((item, index) => {
        initialPositions[item.id] = initialPosArray[index];
      });

      setPositions(initialPositions);
    };

    initializePositions();
  }, []);

  useEffect(() => {
    const startAutoFlip = () => {
      autoFlipIntervalRef.current = setInterval(() => {
        if (isDragging) return;

        const availableItems = socialData.filter(
          (item) => !flipStates[item.id] && item.id !== "calendar"
        );
        if (availableItems.length > 0) {
          const randomItem =
            availableItems[Math.floor(Math.random() * availableItems.length)];

          setAutoFlipStates((prev) => ({
            ...prev,
            [randomItem.id]: true,
          }));

          setTimeout(() => {
            setAutoFlipStates((prev) => ({
              ...prev,
              [randomItem.id]: false,
            }));
          }, 2000);
        }
      }, 3000);
    };

    startAutoFlip();

    return () => {
      if (autoFlipIntervalRef.current) {
        clearInterval(autoFlipIntervalRef.current);
      }
    };
  }, [flipStates, isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    setMouseDownPosition({ x: e.clientX, y: e.clientY });
    setHasDragged(false);

    const rect = e.currentTarget.getBoundingClientRect();

    setDraggedItem({
      id,
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    });

    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedItem) return;

    const distanceMoved = Math.sqrt(
      Math.pow(e.clientX - mouseDownPosition.x, 2) +
      Math.pow(e.clientY - mouseDownPosition.y, 2)
    );

    if (distanceMoved > 5) {
      setIsDragging(true);
      setHasDragged(true);
    }

    let newX = e.clientX - draggedItem.offset.x;
    let newY = e.clientY - draggedItem.offset.y;

    const draggedItemSize =
      socialData.find((item) => item.id === draggedItem.id) ?? {
        width: 400,
        height: 100,
      };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Constrain positions so items don’t go offscreen with padding buffer
    const minX = -DRAG_PADDING;
    const maxX = viewportWidth - (draggedItemSize.width ?? 400) + DRAG_PADDING;
    const minY = -DRAG_PADDING;
    const maxY = viewportHeight - (draggedItemSize.height ?? 100) + DRAG_PADDING;

    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    setPositions((prev) => ({
      ...prev,
      [draggedItem.id]: { x: newX, y: newY },
    }));
  };

  const handleMouseUp = () => {
    setDraggedItem(null);

    setTimeout(() => {
      setIsDragging(false);
      setHasDragged(false);
    }, 100);

    document.body.style.userSelect = "";
  };

  const handleMouseEnter = (id: string) => {
    if (isDragging) return;
    setFlipStates((prev) => ({ ...prev, [id]: true }));
    setAutoFlipStates((prev) => ({ ...prev, [id]: false }));
  };

  const handleMouseLeave = (id: string) => {
    if (isDragging) return;
    setFlipStates((prev) => ({ ...prev, [id]: false }));
  };

  const handleTextClick = (e: React.MouseEvent, id: string, url: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging && !hasDragged && !draggedItem) {
      if (id === "calendar") {
        console.log("Calendar clicked!");
      } else {
        window.open(url, "_blank");
      }
    }
  };

  const revealerDone = useRevealer();

  return (
    <>
      <div className="revealer fixed inset-0 bg-purple-600 origin-top z-50"></div>

      <div
        className="fixed inset-0 bg-red-600 select-none min-h-screen w-full flex"
        ref={containerRef}
        style={{ cursor: draggedItem ? "grabbing" : "default" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Social + Calendar Items */}
        <div className="relative w-full h-full">
          {/* Title */}
          <div className="absolute top-8 left-8 z-50">
            <h1 className="text-6xl font-black text-white tracking-wider drop-shadow-2xl">
              CONTACT ME
            </h1>
          </div>

          

          {/* Render each social item and calendar */}
          {socialData.map((item) => {
            const position = positions[item.id];
            if (!position) return null;

            const isManuallyFlipped = flipStates[item.id] || false;
            const isAutoFlipped = autoFlipStates[item.id] || false;
            const isFlipped = isManuallyFlipped || isAutoFlipped;
            const isBeingDragged = draggedItem?.id === item.id;

            return (
              <div
                key={item.id}
                className={`absolute z-30 select-none transition-all duration-200 ease-out ${
                  isBeingDragged ? "z-50 cursor-grabbing" : "cursor-grab hover:scale-105"
                }`}
                style={{
                  left: position.x,
                  top: position.y,
                  transform: isBeingDragged ? "scale(1.1) rotate(2deg)" : "scale(1)",
                  transition: isBeingDragged ? "none" : "transform 0.2s ease",
                  width: item.width ?? 400,
                  height: item.height ?? 100,
                }}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
                onClick={(e) => handleTextClick(e, item.id, item.url)}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={() => handleMouseLeave(item.id)}
              >
                {item.id === "calendar" ? (
                  <DraggableResizableCal
                    calLink="shubham-maurya-ucvmce"
                    initialPosition={{ x: 0, y: 0 }}
                    initialSize={{
                      width: item.width ?? 400,
                      height: item.height ?? 600,
                    }}
                  />
                ) : (
                  <div className="relative w-full h-full overflow-visible">
                    <div
                      className={`font-black text-6xl text-white tracking-wider whitespace-nowrap transition-all duration-300 ${
                        isBeingDragged ? "text-yellow-300" : ""
                      }`}
                      style={{
                        textShadow: "4px 4px 8px rgba(0,0,0,0.8)",
                        transform: isFlipped ? "translateY(-100%)" : "translateY(0)",
                        opacity: isFlipped ? 0 : 1,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 8,
                        paddingRight: 8,
                      }}
                    >
                      {item.text1}
                    </div>

                    <div
                      className={`absolute top-0 left-0 font-black text-6xl text-white tracking-wider whitespace-nowrap transition-all duration-300 ${
                        isBeingDragged ? "text-yellow-300" : ""
                      }`}
                      style={{
                        textShadow: "4px 4px 8px rgba(0,0,0,0.8)",
                        transform: isFlipped ? "translateY(0)" : "translateY(100%)",
                        opacity: isFlipped ? 1 : 0,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        position: "absolute",
                        paddingLeft: 8,
                        paddingRight: 8,
                      }}
                    >
                      {item.text2}
                    </div>
                  </div>
                )}

                {isBeingDragged && (
                  <div className="absolute inset-0 bg-yellow-300/20 blur-xl -z-10 scale-150 animate-pulse rounded"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DraggableTextFlipper;
