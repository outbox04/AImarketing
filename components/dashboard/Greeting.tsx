"use client";

import { CalendarClock } from "lucide-react";
import React from "react";

type GreetingProps = {
  ownerName: string;
};

export default function Greeting({ ownerName }: GreetingProps) {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const totalMinutes = hour * 60 + minute;

  let label = "buổi tối";
  let badge = "Evening Digest";

  // Ranges (in minutes from 00:00):
  // Buổi đêm: 00:00 - 04:59 => 0 - 299
  // Buổi sáng: 05:00 - 11:30 => 300 - 690
  // Buổi trưa: 11:31 - 12:59 => 691 - 779
  // Buổi chiều: 13:00 - 18:00 => 780 - 1080
  // Buổi chiều tối: 18:01 - 18:30 => 1081 - 1110
  // Buổi tối: 18:31 - 23:59 => 1111 - 1439

  if (totalMinutes >= 300 && totalMinutes <= 690) {
    label = "buổi sáng";
    badge = "Morning Digest";
  } else if (totalMinutes >= 691 && totalMinutes <= 779) {
    label = "buổi trưa";
    badge = "Noon Digest";
  } else if (totalMinutes >= 780 && totalMinutes <= 1080) {
    label = "buổi chiều";
    badge = "Afternoon Digest";
  } else if (totalMinutes >= 1081 && totalMinutes <= 1110) {
    label = "buổi chiều tối";
    badge = "Early Evening Digest";
  } else if (totalMinutes >= 1111 && totalMinutes <= 1439) {
    label = "buổi tối";
    badge = "Evening Digest";
  } else {
    label = "buổi đêm";
    badge = "Night Digest";
  }

  return (
    <>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-sm font-semibold text-primary">
        <CalendarClock size={16} />
        {badge}
      </div>
      <h1 className="text-3xl font-bold tracking-normal text-text-main md:text-4xl">Chào {label}, {ownerName}.</h1>
    </>
  );
}
