import React from "react";
import { Card } from "./Card";

interface SkeletonProps {
  h?: number;
  w?: number | string;
  className?: string;
}

export function Skeleton({ h = 20, w, className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-active rounded animate-pulse ${className}`}
      style={{ height: h, width: w ?? "100%" }}
    />
  );
}

export function SkeletonCard() {
  return (
    <Card>
      <Skeleton h={14} w={120} />
      <div className="mt-3">
        <Skeleton h={32} w={90} />
      </div>
      <div className="mt-3">
        <Skeleton h={12} w="60%" />
      </div>
    </Card>
  );
}
