"use client";
import { useEffect, useRef } from "react";

export function HeroCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      !matchMedia("(pointer: fine) and (min-width: 1024px)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let points: { x: number; y: number; life: number }[] = [];
    const resize = () => {
      const rect = canvas.getBoundingClientRect(),
        ratio = Math.min(devicePixelRatio, 2);
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      )
        points.push({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          life: 1,
        });
    };
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);
      points = points
        .map((point) => ({ ...point, life: point.life - 0.025 }))
        .filter((point) => point.life > 0)
        .slice(-36);
      if (points.length > 1) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const previous = points[i - 1],
            point = points[i],
            midX = (previous.x + point.x) / 2,
            midY = (previous.y + point.y) / 2;
          context.quadraticCurveTo(previous.x, previous.y, midX, midY);
        }
        const gradient = context.createLinearGradient(
          points[0].x,
          points[0].y,
          points.at(-1)!.x,
          points.at(-1)!.y,
        );
        gradient.addColorStop(0, "rgba(126,160,244,0)");
        gradient.addColorStop(1, "rgba(126,160,244,.52)");
        context.strokeStyle = gradient;
        context.lineWidth = 1.5;
        context.lineCap = "round";
        context.stroke();
      }
      frame = requestAnimationFrame(draw);
    };
    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] hidden h-full w-full lg:block"
    />
  );
}
